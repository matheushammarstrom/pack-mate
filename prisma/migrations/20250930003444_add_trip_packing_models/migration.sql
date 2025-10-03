-- CreateEnum
CREATE TYPE "public"."TripType" AS ENUM ('BUSINESS', 'LEISURE', 'ADVENTURE', 'BEACH', 'CITY_BREAK', 'CAMPING', 'CRUISE', 'BACKPACKING', 'FAMILY', 'ROMANTIC', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."ItemCategory" AS ENUM ('CLOTHING', 'ELECTRONICS', 'TOILETRIES', 'DOCUMENTS', 'MEDICINE', 'FOOD_SNACKS', 'ENTERTAINMENT', 'ACCESSORIES', 'SHOES', 'OUTERWEAR', 'UNDERWEAR', 'SWIMWEAR', 'SPORTS_EQUIPMENT', 'OTHER');

-- CreateTable
CREATE TABLE "public"."Trip" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "tripType" "public"."TripType" NOT NULL,
    "description" TEXT,
    "weatherData" JSONB,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PackingList" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "aiPrompt" TEXT NOT NULL,
    "aiModel" TEXT NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PackingList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PackingItem" (
    "id" TEXT NOT NULL,
    "packingListId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "public"."ItemCategory" NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "isPacked" BOOLEAN NOT NULL DEFAULT false,
    "isEssential" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "packedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PackingItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Trip_userId_idx" ON "public"."Trip"("userId");

-- CreateIndex
CREATE INDEX "Trip_startDate_idx" ON "public"."Trip"("startDate");

-- CreateIndex
CREATE UNIQUE INDEX "PackingList_tripId_key" ON "public"."PackingList"("tripId");

-- CreateIndex
CREATE INDEX "PackingItem_packingListId_idx" ON "public"."PackingItem"("packingListId");

-- CreateIndex
CREATE INDEX "PackingItem_category_idx" ON "public"."PackingItem"("category");

-- AddForeignKey
ALTER TABLE "public"."Trip" ADD CONSTRAINT "Trip_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PackingList" ADD CONSTRAINT "PackingList_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "public"."Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PackingItem" ADD CONSTRAINT "PackingItem_packingListId_fkey" FOREIGN KEY ("packingListId") REFERENCES "public"."PackingList"("id") ON DELETE CASCADE ON UPDATE CASCADE;
