export function isUniqueViolation(err: any) {
  return err?.code === "23505";
}
