/**
 * Calculates a 'power score' for a given entity (player or NPC ship).
 * @param {object} entity - The player object or an NPC Ship object.
 * @returns {number} The calculated Total Power score.
 */
export function calculateEntityPower(entity) {
    let power = 0;
    const isPlayer = entity.name === "Player";
    const ship = isPlayer ? entity.ship : entity;

    if (!ship) return 0;

    // 1. Value from Ship Stats (using max values for consistency)
    power += (ship.max_hull || ship.hull || 0) / 10;
    power += (ship.max_shields || ship.shields || 0) / 10;
    power += (ship.maxFighters || ship.fighter_squadrons || 0) * 5;
    power += (ship.maxMissiles || ship.missile_launchers || 0) * 20;
    power += (ship.maxMines || ship.mines || 0) * 10;
    power += (ship.maxGndForces || ship.gndForces || 0) * 2;
    power += (ship.scanner?.range || 0) * 100;
    power += (ship.computerLevel || 1) * 500;

    // 2. Value from Credits
    const credits = isPlayer ? entity.credits : (ship.bounty * 10 || 5000);
    power += credits / 20;

    // 3. Value from Kills
    const kills = entity.kills || 0;
    power += kills * 1000;

    // 4. Value from Territory (only for the player)
    if (isPlayer) {
        const ownedPorts = game.ports.filter(p => p.owner === game.player.name).length;
        const ownedPlanets = game.planets.filter(p => p.ownership === game.player.name).length;
        power += (ownedPorts + ownedPlanets) * 2500;
    }

    return Math.floor(power);
}
