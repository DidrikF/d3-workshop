import { User } from "@prisma/client";

export const isDefined = <T>(argument: T | undefined | null): argument is T =>
  argument != null;

export function getName(
  user: { name: string | null | undefined } | undefined
): string {
  return user?.name?.split(" ")[0] ?? "Unknown name";
}
