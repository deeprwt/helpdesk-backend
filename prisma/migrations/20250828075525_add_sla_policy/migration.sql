-- AlterTable
ALTER TABLE "public"."Ticket" ADD COLUMN     "due_resolution_at" TIMESTAMP(3),
ADD COLUMN     "due_response_at" TIMESTAMP(3),
ADD COLUMN     "first_response_at" TIMESTAMP(3),
ADD COLUMN     "resolved_at" TIMESTAMP(3),
ADD COLUMN     "slaPolicyId" TEXT,
ADD COLUMN     "sla_breached" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- CreateTable
CREATE TABLE "public"."SLAPolicy" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "priority" "public"."Priority" NOT NULL,
    "responseTimeMins" INTEGER NOT NULL,
    "resolutionTimeMins" INTEGER NOT NULL,
    "businessHours" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "SLAPolicy_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Ticket" ADD CONSTRAINT "Ticket_slaPolicyId_fkey" FOREIGN KEY ("slaPolicyId") REFERENCES "public"."SLAPolicy"("id") ON DELETE SET NULL ON UPDATE CASCADE;
