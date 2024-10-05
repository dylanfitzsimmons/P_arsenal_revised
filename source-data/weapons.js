import {
    NONE,
    TILE_WEAPON_TYPE_GROUND_ID,
    TILE_WEAPON_TYPE_ONLY_AA_ID,
    TILE_WEAPON_TYPE_WITH_AA_ID,
    TILE_TYPE_INFANTRY_ID,
    TILE_TYPE_CAVALRY_ID,
    TILE_TYPE_VEHICLE_ID,
    TILE_TYPE_BUILDING_ID,
} from './constants';

import weaponData from '../../../source-data/imported/weapons.json';
import {arcSizeById, targetingById} from './options';

const WEAPON_TYPE_MOD = {
    [TILE_WEAPON_TYPE_GROUND_ID]: 10/13,
    [TILE_WEAPON_TYPE_WITH_AA_ID]: 1,
    [TILE_WEAPON_TYPE_ONLY_AA_ID]: 4/13,
};

let infantryData = weaponData.filter(item => item.is_infantry);
let vehicleData  = weaponData.filter(item => !item.is_infantry && !item.is_building);
let buildingData  = weaponData.filter(item => item.is_building);

const infantry = Repo(infantryData);
const vehicle  = Repo(vehicleData);
const building = Repo(buildingData)

const map = {
    [TILE_TYPE_INFANTRY_ID]: infantry,
    [TILE_TYPE_CAVALRY_ID]: infantry,
    [TILE_TYPE_VEHICLE_ID]: vehicle,
    [TILE_TYPE_BUILDING_ID]: building,
};

export default function (tileTypeId) {
    return map[tileTypeId];
}

function Repo(data) {
    let defaults = {
        aa: NONE,
        at: NONE,
        ap: NONE,
        is_indirect: false,
        has_warheads: false,
    };

    const repo = {};

    data.forEach((item) => {
        repo[item.id] = Object.assign({}, defaults, item);
    });

    function all() {
        return repo;
    }

    function toItem(id) {
        let item = repo[id];
        if (!item) {
            throw new Error('invalid weapon id: ' + id);
        }
        return item;
    }

    function firstId() {
        let keys = Object.keys(repo);
        return keys[0];
    }

    function get(id, tileWeaponTypeId = 1) {
        if (tileWeaponTypeId === TILE_WEAPON_TYPE_GROUND_ID) {
            return getGround(id);
        }

        if (tileWeaponTypeId === TILE_WEAPON_TYPE_WITH_AA_ID) {
            return getWithAA(id);
        }

        if (tileWeaponTypeId === TILE_WEAPON_TYPE_ONLY_AA_ID) {
            return getOnlyAA(id);
        }
        throw new Error('invalid tile weapon type');
    }

    function getGround(id) {
        let item = toItem(id);
        return Object.assign({}, item, {
            aa: NONE,
        });
    }

    function getWithAA(id) {
        let item = toItem(id);
        return Object.assign({}, item);
    }

    function getOnlyAA(id) {
        let item = toItem(id);
        return Object.assign({}, item, {
            at: NONE,
            ap: NONE,
        });
    }

    function cost(attackStatId, weaponId, arcSizeId, weaponTypeId) {
        let attackDie   = targetingById[attackStatId].name;
        let item        = toItem(weaponId);
        let typeMod     = WEAPON_TYPE_MOD[weaponTypeId];
        let arcMod      = arcSizeById[arcSizeId].cost_multiplier;
        let key         = 'cost_' + attackDie.toLowerCase();
        let attackCost = item[key];
        let baseCost = Math.round(attackCost * arcMod);
        let cost = Math.round(baseCost * typeMod);
        return Math.max(1, cost);
    }

    return {
        all,
        firstId,
        get,
        cost,
    };
}
