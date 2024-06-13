-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Posts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "tags" TEXT,
    "markdownText" TEXT NOT NULL,
    "dateCreate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateUpdate" DATETIME,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Posts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Posts" ("id", "markdownText", "tags", "title", "userId") SELECT "id", "markdownText", "tags", "title", "userId" FROM "Posts";
DROP TABLE "Posts";
ALTER TABLE "new_Posts" RENAME TO "Posts";
CREATE UNIQUE INDEX "Posts_id_key" ON "Posts"("id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
