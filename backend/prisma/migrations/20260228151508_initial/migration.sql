-- CreateTable
CREATE TABLE "wheres_pooh_leaderboard" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "time" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wheres_pooh_leaderboard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "wheres_pooh_leaderboard_username_key" ON "wheres_pooh_leaderboard"("username");
