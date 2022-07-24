import { Score, User } from "@prisma/client";

export type ScoreWithUser = Score & { user: User };

export type UserData = User & { Score: ScoreWithUser[] };
