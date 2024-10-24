-- CreateTable
CREATE TABLE "Uutiset" (
    "uutisId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "otsikko" TEXT NOT NULL,
    "sisalto" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Kayttajat" (
    "kayttajaId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "kayttajatunnus" TEXT NOT NULL,
    "salasana" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Kommentit" (
    "kommenttiId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uutisId" INTEGER NOT NULL,
    "kayttajatunnus" TEXT NOT NULL,
    "kommentti" TEXT NOT NULL,
    "aikaleima" TEXT NOT NULL
);
