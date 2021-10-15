Events.on(ClientLoadEvent, () => {
const simplex = new Packages.arc.util.noise.Simplex();
const rid = new Packages.arc.util.noise.RidgedPerlin(1, 2);

const ClesiaPlanetGenerator = extend(PlanetGenerator, {
    getColor(position){
        var block = this.getBlock(position);

        Tmp.c1.set(block.mapColor).a = 1 - block.albedo;
        return Tmp.c1
    },
    
    getBlock(pos){
	    var height = this.rawHeight(pos);
	
	    Tmp.v31.set(pos);
	    pos = Tmp.v33.set(pos).scl(ClesiaPlanetGenerator.scl);
	    var rad = ClesiaPlanetGenerator.scl;
	    var temp = Mathf.clamp(Math.abs(pos.y * 2) / rad);
	    var tnoise = simplex.octaveNoise3D(7, 0.56, 1 / 3, pos.x, pos.y + 999, pos.z);
	    temp = Mathf.lerp(temp, tnoise, 0.5);
	    height *= 1.2
	    height = Mathf.clamp(height);
	
	    var tar = simplex.octaveNoise3D(4, 0.55, 0.5, pos.x, pos.y + 999, pos.z) * 0.3 + Tmp.v31.dst(0, 0, 1) * 0.2;
	    var res = ClesiaPlanetGenerator.arr[
	       Mathf.clamp(Mathf.floor(temp * ClesiaPlanetGenerator.arr.length), 5, ClesiaPlanetGenerator.arr[0].length - 1)][ Mathf.clamp(Mathf.floor(height * ClesiaPlanetGenerator.arr[0].length), 5, ClesiaPlanetGenerator.arr[0].length - 1)
	    ];
	
	    if (tar > 0.5){
	        return ClesiaPlanetGenerator.tars.get(res, res);
	    } else {
	        return res;
	    };
    },
    
    rawHeight(pos){
		var pos = Tmp.v33.set(pos);
		pos.scl(ClesiaPlanetGenerator.scl);
		
		return (Mathf.pow(simplex.octaveNoise3D(7, 0.5, 1 / 3, pos.x, pos.y, pos.z), 2.3) + ClesiaPlanetGenerator.waterOffset) / (1 + ClesiaPlanetGenerator.waterOffset);  
    },
    
    getHeight(position){
        var height = this.rawHeight(position);
        return Math.max(height, ClesiaPlanetGenerator.water);
    },
    
    genTile(position, tile){
        tile.floor = this.getBlock(position);
        tile.block = tile.floor.asFloor().wall;

        if(rid.getValue(position.x, position.y, position.z, 22) > 0.32){
            tile.block = Blocks.air;
        }
    }
    
});

ClesiaPlanetGenerator.arr = [
    [Blocks.grass, Blocks.stone, Blocks.sand, Blocks.sand, Blocks.sand, Blocks.grass, Blocks.grass, Blocks.snow, Blocks.snow, Blocks.grass, Blocks.sandWater, Blocks.stone, Blocks.stone],
    [Blocks.grass, Blocks.sandWater, Blocks.grass, Blocks.grass, Blocks.grass, Blocks.grass, Blocks.grass, Blocks.grass, Blocks.sand, Blocks.sandWater, Blocks.stone, Blocks.stone, Blocks.stone],
    [Blocks.water, Blocks.sandWater, Blocks.grass, Blocks.grass, Blocks.salt, Blocks.sand, Blocks.salt, Blocks.sand, Blocks.sand, Blocks.sandWater, Blocks.stone, Blocks.stone, Blocks.stone],
    [Blocks.water, Blocks.sandWater, Blocks.grass, Blocks.salt, Blocks.salt, Blocks.dacite, Blocks.sand, Blocks.stone, Blocks.stone, Blocks.stone, Blocks.snow, Blocks.iceSnow, Blocks.ice],  
    [Blocks.grass, Blocks.stone, Blocks.sandWater, Blocks.sand, Blocks.salt, Blocks.salt, Blocks.dacite, Blocks.dacite, Blocks.snow, Blocks.snow, Blocks.snow, Blocks.ice, Blocks.ice],  
    [Blocks.grass, Blocks.stone, Blocks.sandWater, Blocks.sand, Blocks.sand, Blocks.sand, Blocks.stone, Blocks.iceSnow, Blocks.snow, Blocks.snow, Blocks.ice, Blocks.ice, Blocks.ice],  
    [Blocks.grass, Blocks.sandWater, Blocks.sand, Blocks.sand, Blocks.stone, Blocks.stone, Blocks.snow, Blocks.snow, Blocks.snow, Blocks.ice, Blocks.ice, Blocks.snow, Blocks.ice],  
    [Blocks.water, Blocks.sandWater, Blocks.sand, Blocks.sand, Blocks.craters, Blocks.stone, Blocks.snow, Blocks.snow, Blocks.snow, Blocks.ice, Blocks.snow, Blocks.ice, Blocks.ice],  
    [Blocks.sandWater, Blocks.sand, Blocks.sand, Blocks.sand, Blocks.stone, Blocks.grass, Blocks.snow, Blocks.snow, Blocks.snow, Blocks.snow, Blocks.snow, Blocks.ice, Blocks.ice],
    [Blocks.sandWater, Blocks.sand, Blocks.sand, Blocks.grass, Blocks.ice, Blocks.ice, Blocks.snow, Blocks.snow, Blocks.snow, Blocks.snow, Blocks.ice, Blocks.ice, Blocks.ice], 
    [Blocks.water, Blocks.sandWater, Blocks.sand, Blocks.salt, Blocks.salt, Blocks.dacite, Blocks.dacite, Blocks.snow, Blocks.snow, Blocks.ice, Blocks.ice, Blocks.ice, Blocks.ice], 
    [Blocks.sandWater, Blocks.sandWater, Blocks.sand, Blocks.salt, Blocks.salt, Blocks.dacite, Blocks.iceSnow, Blocks.snow, Blocks.ice, Blocks.ice, Blocks.ice, Blocks.ice, Blocks.ice],
    [Blocks.dacite, Blocks.dacite, Blocks.snow, Blocks.ice, Blocks.iceSnow, Blocks.snow, Blocks.snow, Blocks.snow, Blocks.ice, Blocks.ice, Blocks.ice, Blocks.ice, Blocks.ice]
];
ClesiaPlanetGenerator.scl = 5.0;
ClesiaPlanetGenerator.waterOffset = 0.08;
ClesiaPlanetGenerator.basegen = new BaseGenerator();
ClesiaPlanetGenerator.water = 2;

ClesiaPlanetGenerator.dec = new ObjectMap().of(
    Blocks.grass, Blocks.stone,
    Blocks.grass, Blocks.stone,
    Blocks.sand, Blocks.water,
    Blocks.darksandWater, Blocks.darksandWater
);

ClesiaPlanetGenerator.tars = new ObjectMap().of(
    Blocks.grass, Blocks.grass,
    Blocks.stone, Blocks.dacite
);
    const clesia = new Planet("clesia", Planets.sun, 3, 0.8);
    clesia.generator = ClesiaPlanetGenerator;
    clesia.mesh = new HexMesh(clesia, 5);
    clesia.bloom = true;
    clesia.radius = 1;
    clesia.accessible = true;
    clesia.hasAtmosphere = true;
    clesia.atmosphereColor = Color.valueOf("34e233");
    clesia.atmosphereRadIn = 0.02;
    clesia.atmosphereRadOut = 0.3;
    clesia.localizedName = "Clesia";
    clesia.startSector = 1;
    
    const stainedValley = new SectorPreset("stainedValley", clesia, 1);
    stainedValley.captureWave = 35;
    stainedValley.localizedName = "Stained Valley";
    stainedValley.difficulty = 3;
    stainedValley.alwaysUnlocked = true;

    const shredPaths = new SectorPreset("shredPaths", clesia, 2);
    shredPaths.captureWave = 45;
    shredPaths.localizedName = "Shred Paths";
    shredPaths.difficulty = 5;
    shredPaths.alwaysUnlocked = false;

    const terraMaze = new SectorPreset("terraMaze", clesia, 34);
    terraMaze.captureWave = 35;
    terraMaze.localizedName = "Terra Maze";
    terraMaze.difficulty = 3;
    terraMaze.alwaysUnlocked = false;

    const rackedPlains = new SectorPreset("rackedPlains", clesia, 56);
    rackedPlains.captureWave = 50;
    rackedPlains.localizedName = "Racked Plains";
    rackedPlains.difficulty = 5;
    rackedPlains.alwaysUnlocked = false;

    const vanacano = new SectorPreset("vanacano", clesia, 247);
    vanacano.captureWave = 60;
    vanacano.localizedName = "Vanacano";
    vanacano.difficulty = 10;
    vanacano.alwaysUnlocked = false;

    const nuclearPassage = new SectorPreset("nuclearPassage", clesia, 87);
    nuclearPassage.captureWave = 35;
    nuclearPassage.localizedName = "Nuclear Passage";
    nuclearPassage.difficulty = 12;
    nuclearPassage.alwaysUnlocked = false;

    const deltaQuarters = new SectorPreset("deltaQuarters", clesia, 59);
    deltaQuarters.captureWave = 35;
    deltaQuarters.localizedName = "Delta Quarters";
    deltaQuarters.difficulty = 8;
    deltaQuarters.alwaysUnlocked = false;

    const reinforcedPatrolStation = new SectorPreset("reinforcedPatrolStation", clesia, 90);
    reinforcedPatrolStation.captureWave = 50;
    reinforcedPatrolStation.localizedName = "Reinforced Patrol Station";
    reinforcedPatrolStation.difficulty = 7;
    reinforcedPatrolStation.alwaysUnlocked = false;

});
