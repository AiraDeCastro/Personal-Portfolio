// GET -> { authenticated: boolean }. Used by admin.html on load to decide
// whether to show the password form or the project list.
import { isValidSession } from './_session.js';

export default function handler(req, res) {
  res.status(200).json({ authenticated: isValidSession(req.headers.cookie) });
}
