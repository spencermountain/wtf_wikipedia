// registers every language pack, applied one by one — 'other' carries the wikis without a pack of their own.
// the shipped list + metadata lives in src/languages.json; imports stay static so rollup can bundle them
import register from '../../register.js'
import version from '../../_version.js'
import ar from '../ar/index.js'
import bg from '../bg/index.js'
import bn from '../bn/index.js'
import ca from '../ca/index.js'
import cs from '../cs/index.js'
import da from '../da/index.js'
import de from '../de/index.js'
import el from '../el/index.js'
import es from '../es/index.js'
import fa from '../fa/index.js'
import fi from '../fi/index.js'
import fr from '../fr/index.js'
import he from '../he/index.js'
import hi from '../hi/index.js'
import hr from '../hr/index.js'
import hu from '../hu/index.js'
import id from '../id/index.js'
import it from '../it/index.js'
import ja from '../ja/index.js'
import ko from '../ko/index.js'
import ms from '../ms/index.js'
import nl from '../nl/index.js'
import no from '../no/index.js'
import pl from '../pl/index.js'
import pt from '../pt/index.js'
import ro from '../ro/index.js'
import ru from '../ru/index.js'
import simple from '../simple/index.js'
import sk from '../sk/index.js'
import sr from '../sr/index.js'
import sv from '../sv/index.js'
import th from '../th/index.js'
import tr from '../tr/index.js'
import uk from '../uk/index.js'
import vi from '../vi/index.js'
import zh from '../zh/index.js'
import other from '../other/index.js'

// one pack per languages.json entry, 'other' last so packs win shared names
const packs = [
  ar, bg, bn, ca, cs, da, de, el, es, fa, fi, fr, he, hi, hr, hu, id, it, ja, ko, ms, nl,
  no, pl, pt, ro, ru, simple, sk, sr, sv, th, tr, uk, vi, zh, other,
]

const plugin = (_models, templates, infoboxes, i18n) => {
  packs.forEach((pack) => {
    register(pack, templates, infoboxes, i18n)
  })
}
plugin.version = version

export default plugin
