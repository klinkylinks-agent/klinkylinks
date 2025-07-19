// inside setupAuth, replace your app.post("/api/register", ...) with:

app.post(
  "/api/register",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 1) Grab & validate each field as a string
      const {
        email: rawEmail,
        password: rawPassword,
        confirmPassword: rawConfirm,
        firstName: rawFirst,
        lastName: rawLast,
      } = req.body as Record<string, unknown>;

      if (
        typeof rawEmail !== "string" ||
        typeof rawPassword !== "string" ||
        typeof rawConfirm !== "string"
      ) {
        return res
          .status(400)
          .json({ message: "Email, password & confirmPassword required" });
      }

      const email = rawEmail.trim();
      const password = rawPassword;
      const confirmPassword = rawConfirm;

      // optional name fields
      const firstName =
        typeof rawFirst === "string" ? rawFirst.trim() : null;
      const lastName =
        typeof rawLast === "string" ? rawLast.trim() : null;

      // 2) Basic checks
      if (!email || !password || !confirmPassword) {
        return res
          .status(400)
          .json({ message: "Email, password & confirmPassword required" });
      }
      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
      }
      if (await storage.getUserByEmail(email)) {
        return res.status(400).json({ message: "Email already registered" });
      }

      // 3) Create user
      const hashed = await hashPassword(password);
      const newUser = await storage.createUser({
        email,
        password: hashed,
        firstName,
        lastName,
        role: "user",
        subscriptionStatus: "free",
        subscriptionTier: "free",
      });

      // 4) Log them in
      req.logIn(newUser, (err) => {
        if (err) return next(err);
        res.status(201).json(newUser);
      });
    } catch (err: any) {
      console.error("[REGISTER] Error:", err);
      res.status(500).json({ message: err.message });
    }
  }
);
