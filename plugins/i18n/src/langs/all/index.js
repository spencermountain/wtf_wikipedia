// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// every language pack, applied one by one — 'other' carries the wikis without a pack of their own
import ar from '../ar/index.js'
import az from '../az/index.js'
import be from '../be/index.js'
import bg from '../bg/index.js'
import bn from '../bn/index.js'
import ca from '../ca/index.js'
import cs from '../cs/index.js'
import cy from '../cy/index.js'
import da from '../da/index.js'
import de from '../de/index.js'
import el from '../el/index.js'
import eo from '../eo/index.js'
import es from '../es/index.js'
import et from '../et/index.js'
import eu from '../eu/index.js'
import fa from '../fa/index.js'
import fi from '../fi/index.js'
import fr from '../fr/index.js'
import gl from '../gl/index.js'
import he from '../he/index.js'
import hi from '../hi/index.js'
import hr from '../hr/index.js'
import hu from '../hu/index.js'
import hy from '../hy/index.js'
import id from '../id/index.js'
import it from '../it/index.js'
import ja from '../ja/index.js'
import ka from '../ka/index.js'
import kk from '../kk/index.js'
import ko from '../ko/index.js'
import lt from '../lt/index.js'
import lv from '../lv/index.js'
import mk from '../mk/index.js'
import ml from '../ml/index.js'
import ms from '../ms/index.js'
import nl from '../nl/index.js'
import nn from '../nn/index.js'
import no from '../no/index.js'
import pl from '../pl/index.js'
import pt from '../pt/index.js'
import ro from '../ro/index.js'
import ru from '../ru/index.js'
import sh from '../sh/index.js'
import simple from '../simple/index.js'
import sk from '../sk/index.js'
import sl from '../sl/index.js'
import sq from '../sq/index.js'
import sr from '../sr/index.js'
import sv from '../sv/index.js'
import ta from '../ta/index.js'
import te from '../te/index.js'
import th from '../th/index.js'
import tr from '../tr/index.js'
import uk from '../uk/index.js'
import ur from '../ur/index.js'
import uz from '../uz/index.js'
import vi from '../vi/index.js'
import zh from '../zh/index.js'
import other from '../other/index.js'
import version from '../../_version.js'

const plugin = (models, templates, infoboxes) => {
  ar(models, templates, infoboxes)
  az(models, templates, infoboxes)
  be(models, templates, infoboxes)
  bg(models, templates, infoboxes)
  bn(models, templates, infoboxes)
  ca(models, templates, infoboxes)
  cs(models, templates, infoboxes)
  cy(models, templates, infoboxes)
  da(models, templates, infoboxes)
  de(models, templates, infoboxes)
  el(models, templates, infoboxes)
  eo(models, templates, infoboxes)
  es(models, templates, infoboxes)
  et(models, templates, infoboxes)
  eu(models, templates, infoboxes)
  fa(models, templates, infoboxes)
  fi(models, templates, infoboxes)
  fr(models, templates, infoboxes)
  gl(models, templates, infoboxes)
  he(models, templates, infoboxes)
  hi(models, templates, infoboxes)
  hr(models, templates, infoboxes)
  hu(models, templates, infoboxes)
  hy(models, templates, infoboxes)
  id(models, templates, infoboxes)
  it(models, templates, infoboxes)
  ja(models, templates, infoboxes)
  ka(models, templates, infoboxes)
  kk(models, templates, infoboxes)
  ko(models, templates, infoboxes)
  lt(models, templates, infoboxes)
  lv(models, templates, infoboxes)
  mk(models, templates, infoboxes)
  ml(models, templates, infoboxes)
  ms(models, templates, infoboxes)
  nl(models, templates, infoboxes)
  nn(models, templates, infoboxes)
  no(models, templates, infoboxes)
  pl(models, templates, infoboxes)
  pt(models, templates, infoboxes)
  ro(models, templates, infoboxes)
  ru(models, templates, infoboxes)
  sh(models, templates, infoboxes)
  simple(models, templates, infoboxes)
  sk(models, templates, infoboxes)
  sl(models, templates, infoboxes)
  sq(models, templates, infoboxes)
  sr(models, templates, infoboxes)
  sv(models, templates, infoboxes)
  ta(models, templates, infoboxes)
  te(models, templates, infoboxes)
  th(models, templates, infoboxes)
  tr(models, templates, infoboxes)
  uk(models, templates, infoboxes)
  ur(models, templates, infoboxes)
  uz(models, templates, infoboxes)
  vi(models, templates, infoboxes)
  zh(models, templates, infoboxes)
  other(models, templates, infoboxes)
}
plugin.version = version

export default plugin
