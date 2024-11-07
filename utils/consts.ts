import {
  Gold,
  Platinum,
  Diamaond,
  Epic,
  Legendary,
  Master,
  Grandmaster,
  Lord,
  Creator,
  main_character,
  character_one,
} from "@/images";
import { StaticImageData } from "next/image";

export const ALLOW_ALL_DEVICES = true;

export const WALLET_MANIFEST_URL =
  "https://yellow-patient-cheetah-559.mypinata.cloud/ipfs/Qman9QdYTU85oVqkyfY7ZoKNHJNjNStASeoL1fQWKkrLoR";

export interface LevelData {
  name: string;
  minPoints: number;
  bigImage: StaticImageData;
  smallImage: StaticImageData;
  color: string;
  friendBonus: number;
  friendBonusPremium: number;
}

export const LEVELS: LevelData[] = [
  {
    name: "Gold",
    minPoints: 0,
    bigImage: character_one,
    smallImage: Gold,
    color: "#2adaf8",
    friendBonus: 0,
    friendBonusPremium: 0,
  },
  {
    name: "Platinum",
    minPoints: 5000,
    bigImage: character_one,
    smallImage: Platinum,
    color: "#d64767",
    friendBonus: 20000,
    friendBonusPremium: 25000,
  },
  {
    name: "Diamaond",
    minPoints: 25000,
    bigImage: character_one,
    smallImage: Diamaond,
    color: "#e9c970",
    friendBonus: 30000,
    friendBonusPremium: 50000,
  },
  {
    name: "Epic",
    minPoints: 100000,
    bigImage: character_one,
    smallImage: Epic,
    color: "#73e94b",
    friendBonus: 40000,
    friendBonusPremium: 75000,
  },
  {
    name: "Legendary",
    minPoints: 1000000,
    bigImage: character_one,
    smallImage: Legendary,
    color: "#4ef0ba",
    friendBonus: 60000,
    friendBonusPremium: 100000,
  },
  {
    name: "Master",
    minPoints: 2000000,
    bigImage: character_one,
    smallImage: Master,
    color: "#1a3ae8",
    friendBonus: 100000,
    friendBonusPremium: 150000,
  },
  {
    name: "Grandmaster",
    minPoints: 10000000,
    bigImage: character_one,
    smallImage: Grandmaster,
    color: "#902bc9",
    friendBonus: 250000,
    friendBonusPremium: 500000,
  },
  {
    name: "Lord",
    minPoints: 50000000,
    bigImage: character_one,
    smallImage: Lord,
    color: "#fb8bee",
    friendBonus: 500000,
    friendBonusPremium: 1000000,
  },
  {
    name: "Creator",
    minPoints: 100000000,
    bigImage: character_one,
    smallImage: Creator,
    color: "#e04e92",
    friendBonus: 1000000,
    friendBonusPremium: 2000000,
  },
];

export const DAILY_REWARDS = [
  500, 1000, 2500, 5000, 15000, 25000, 100000, 500000, 1000000, 5000000,
];

export const MAXIMUM_INACTIVE_TIME_FOR_MINE = 3 * 60 * 60 * 1000; // 3 hours in milliseconds

export const MAX_ENERGY_REFILLS_PER_DAY = 6;
export const ENERGY_REFILL_COOLDOWN = 60 * 60 * 1000; // 1 hour in milliseconds
export const TASK_WAIT_TIME = 60 * 60 * 1000; // 1 hour in milliseconds

export const REFERRAL_BONUS_BASE = 5000;
export const REFERRAL_BONUS_PREMIUM = 25000;

// Multitap
export const multitapUpgradeBasePrice = 1000;
export const multitapUpgradeCostCoefficient = 2;

export const multitapUpgradeBaseBenefit = 1;
export const multitapUpgradeBenefitCoefficient = 1;

// Energy
export const energyUpgradeBasePrice = 1000;
export const energyUpgradeCostCoefficient = 2;

export const energyUpgradeBaseBenefit = 500;
export const energyUpgradeBenefitCoefficient = 1;

// Mine (profit per hour)
export const mineUpgradeBasePrice = 1000;
export const mineUpgradeCostCoefficient = 1.5;

export const mineUpgradeBaseBenefit = 100;
export const mineUpgradeBenefitCoefficient = 1.2;
