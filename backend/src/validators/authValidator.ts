export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface ValidationResult<T> {
  value?: T;
  error?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRegisterInput(
  body: unknown,
): ValidationResult<RegisterInput> {
  if (!body || typeof body !== "object") {
    return { error: "Please provide valid registration details." };
  }

  const input = body as Record<string, unknown>;
  const { name, email, password } = input;

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return { error: "Name, email, and password are required." };
  }

  const normalizedName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();

  if (normalizedName.length < 2 || normalizedName.length > 100) {
    return { error: "Name must be between 2 and 100 characters." };
  }

  if (normalizedEmail.length > 254 || !EMAIL_REGEX.test(normalizedEmail)) {
    return { error: "Please provide a valid email address." };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters long." };
  }

  // bcrypt only uses the first 72 bytes of a password.
  if (Buffer.byteLength(password, "utf8") > 72) {
    return { error: "Password must not exceed 72 bytes." };
  }

  return {
    value: {
      name: normalizedName,
      email: normalizedEmail,
      password,
    },
  };
}

export function validateLoginInput(
  body: unknown,
): ValidationResult<LoginInput> {
  if (!body || typeof body !== "object") {
    return { error: "Email and password are required." };
  }

  const input = body as Record<string, unknown>;
  const { email, password } = input;

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !email.trim() ||
    !password
  ) {
    return { error: "Email and password are required." };
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (normalizedEmail.length > 254 || !EMAIL_REGEX.test(normalizedEmail)) {
    return { error: "Please provide a valid email address." };
  }

  if (Buffer.byteLength(password, "utf8") > 72) {
    return { error: "Invalid email or password." };
  }

  return {
    value: {
      email: normalizedEmail,
      password,
    },
  };
}
