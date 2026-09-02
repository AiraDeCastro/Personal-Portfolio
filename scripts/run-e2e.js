// Runs the built site behind `vite preview`, waits for it to respond, then
// runs the Cypress suite against it. Deliberately avoids the
// `start-server-and-test` package: on newer Windows builds (11 24H2+) its
// process-tree cleanup shells out to `wmic.exe`, which Microsoft removed —
// that crashes the runner during teardown even when every test passed.
// `taskkill /T` does the same job without depending on wmic.
import { execSync, spawn } from 'node:child_process';
import waitOn from 'wait-on';

const isWin = process.platform === 'win32';
const PORT = 4173;
const URL = `http://localhost:${PORT}`;

// Fixed command strings (no user input). On Windows, npm's executable is a
// .cmd shim, which spawn() can only launch through a shell — passed as a
// single string, since args[] alongside shell:true would make Node
// concatenate them itself and emit a DEP0190 warning. Elsewhere, spawn npm
// directly with an argv array (no shell needed).
function runNpm(script) {
  return isWin
    ? spawn(`npm run ${script}`, { stdio: 'inherit', shell: true })
    : spawn('npm', ['run', script], { stdio: 'inherit' });
}

const server = runNpm('preview');

function killServer() {
  if (isWin) {
    try {
      execSync(`taskkill /F /T /PID ${server.pid}`, { stdio: 'ignore' });
    } catch {
      // Already exited — nothing to clean up.
    }
  } else {
    server.kill('SIGTERM');
  }
}

async function main() {
  await waitOn({ resources: [URL], timeout: 30000 });

  await new Promise((resolve, reject) => {
    const cy = runNpm('cy:run');
    cy.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Cypress exited with code ${code}`));
    });
  });
}

main()
  .then(() => {
    killServer();
    process.exit(0);
  })
  .catch((err) => {
    console.error(err.message);
    killServer();
    process.exit(1);
  });
