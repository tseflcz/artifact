import { Artifact } from "../artifact"
import data from "../data"
import { assert, whatis } from "../utils"

export default {
    keymap: {
        affix: {
            hp: 'hp',
            atk: 'atk',
            def: 'def',
            hpp: 'hp_',
            atkp: 'atk_',
            defp: 'def_',
            em: 'eleMas',
            er: 'enerRech_',
            hb: 'heal_',
            cr: 'critRate_',
            cd: 'critDMG_',
            pyroDB: 'pyro_dmg_',
            hydroDB: 'hydro_dmg_',
            electroDB: 'electro_dmg_',
            anemoDB: 'anemo_dmg_',
            cryoDB: 'cryo_dmg_',
            geoDB: 'geo_dmg_',
            physicalDB: 'physical_dmg_',
        }
    },
    loads(json: string) {
        let good = JSON.parse(json)
        assert(typeof good == 'object' && 'artifacts' in good)
        assert(good.artifacts instanceof Array)
        let ret = []
        for (let a of good.artifacts) {
            if (a.rarity !== 5) continue
            let mainKey = whatis(a.mainStatKey, this.keymap.affix) as string
            let artifact = new Artifact({
                set: a.setKey,
                slot: a.slotKey,
                level: a.level,
                rarity: a.rarity,
                lock: a.lock,
                main: {
                    key: mainKey,
                    value: data.mainStat[mainKey][a.level]
                },
                minors: (a.substats as any[]).map(x => ({
                    key: whatis(x.key, this.keymap.affix),
                    value: x.value
                }))
            })
            artifact.data.index = ret.length
            artifact.validate()
            ret.push(artifact)
        }
        return ret
    }
}