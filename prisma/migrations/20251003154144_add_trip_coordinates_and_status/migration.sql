-- CreateEnum
CREATE TYPE "public"."TripProcessingStatus" AS ENUM ('CREATED', 'WEATHER_FETCHING', 'PACKING_GENERATING', 'COMPLETED', 'FAILED');

-- AlterTable
ALTER TABLE "public"."Trip" ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "processingStatus" "public"."TripProcessingStatus" NOT NULL DEFAULT 'CREATED';
