var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import AL from "alclient";
import { Items } from "../types/items";
export var Try = function (fn) { return __awaiter(void 0, void 0, void 0, function () {
    var error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, fn()];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error("Error during attack:", error_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
export var checkCanMoveTo = function (_a) {
    var character = _a.character, entity = _a.entity;
    return AL.Pathfinder.canWalkPath({ map: character.map, x: character.x, y: character.y }, { map: entity.map, x: entity.x, y: entity.y });
};
export var getNearestMonster = function (_a) {
    var character = _a.character, maxAtk = _a.maxAtk, minXp = _a.minXp, targetName = _a.targetName, matchNonHostile = _a.matchNonHostile, doPathCheck = _a.doPathCheck, monsterType = _a.monsterType;
    return character.getEntities().reduce(function (acc, entity) {
        var minimumDistanceFound = acc.minimumDistanceFound;
        var predicates = {
            matchesType: !monsterType || entity.type === monsterType,
            meetsExceedsMinXp: !minXp || entity.xp >= minXp,
            meetsBelowMaxAtk: !maxAtk || entity.attack <= maxAtk,
            matchesName: !targetName || entity.target === targetName,
            matchesNonHostile: !matchNonHostile || entity.target !== character.name,
            pathCheck: !doPathCheck || checkCanMoveTo({ character: character, entity: entity })
        };
        if (!Object.values(predicates).every(Boolean))
            return acc;
        var distanceFromEntity = AL.Tools.distance({ x: character.x, y: character.y, map: character.map }, { x: entity.x, y: entity.y, map: entity.map });
        if (distanceFromEntity < minimumDistanceFound)
            return {
                minimumDistanceFound: distanceFromEntity,
                target: entity
            };
        return acc;
    }, {
        minimumDistanceFound: Number.MAX_VALUE,
        target: null
    }).target;
};
export var checkUseHpOrMp = function (character) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(character.max_hp - character.hp > 200 &&
                    character.getCooldown("use_hp") <= 0)) return [3 /*break*/, 2];
                return [4 /*yield*/, Try(function () { return character.usePotion(0); })];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2:
                if (!(character.max_mp - character.mp > 300 &&
                    character.getCooldown("use_mp") <= 0)) return [3 /*break*/, 4];
                return [4 /*yield*/, Try(function () { return character.usePotion(1); })];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); };
export var basicAttack = function (character, target) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(character.getCooldown("attack") <= 0)) return [3 /*break*/, 2];
                return [4 /*yield*/, Try(function () { return character.basicAttack(target.id); })];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2: return [2 /*return*/];
        }
    });
}); };
export var lootChests = function (character) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, Promise.all(Array.from(character.chests.keys()).map(function (chestId) {
                return Try(function () { return character.openChest(chestId); });
            }))];
    });
}); };
export var restockPotions = function (character) { return __awaiter(void 0, void 0, void 0, function () {
    var healthPotions, manaPotions;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                healthPotions = Array.from(character.getItems().values()).find(function (item) { return item.id === Items.HealthPotion; });
                manaPotions = Array.from(character.getItems().values()).find(function (item) { return item.id === Items.ManaPotion; });
                if (!(!(healthPotions === null || healthPotions === void 0 ? void 0 : healthPotions.q) || healthPotions.q < 10)) return [3 /*break*/, 2];
                return [4 /*yield*/, Try(function () { var _a; return character.buy(Items.HealthPotion, 10 - ((_a = healthPotions === null || healthPotions === void 0 ? void 0 : healthPotions.q) !== null && _a !== void 0 ? _a : 0)); })];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2:
                if (!(!(manaPotions === null || manaPotions === void 0 ? void 0 : manaPotions.q) || manaPotions.q < 10)) return [3 /*break*/, 4];
                return [4 /*yield*/, Try(function () { var _a; return character.buy(Items.ManaPotion, 10 - ((_a = manaPotions === null || manaPotions === void 0 ? void 0 : manaPotions.q) !== null && _a !== void 0 ? _a : 0)); })];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); };
