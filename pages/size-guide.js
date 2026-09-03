import InfoPage from '../components/InfoPage';
import {SizeGuideContent} from '../components/SizeGuide';
const title={en:'Size guide',mk:'Водич за големини',sq:'Udhëzuesi i madhësive'};
const description={en:'A practical way to check your fit before ordering.',mk:'Практичен начин да ја проверите големината пред нарачка.',sq:'Një mënyrë praktike për të kontrolluar madhësinë para porosisë.'};
export default function SizeGuidePage(){return <InfoPage title={title} description={description} path="/size-guide"><SizeGuideContent/></InfoPage>;}
