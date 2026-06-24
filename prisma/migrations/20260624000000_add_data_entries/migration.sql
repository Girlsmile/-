CREATE TABLE "data_entries" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "occurred_on" DATE NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "data_entries_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "data_entries_user_id_occurred_on_idx" ON "data_entries"("user_id", "occurred_on");
