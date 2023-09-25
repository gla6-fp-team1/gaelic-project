import { Router } from "express";

import logger from "./utils/logger";

const router = Router();

router.get("/", (_, res) => {
	logger.debug("Welcoming everyone...");
	const text = [
		"Bhiodh iad a' dèanamh móran uisge-bheatha bho chionn fhada ro n a latha againn.",
		"Tha iad ris an Gearrloch fhathast.",
		"Well, chuala mi gun robh iad ris an Gearrloch a sin.",
		"Bha iad a' faicinn bòcan shios ann an Arasaig.",
		"agus 's e a'chiad rud a bha iad a' faicinn dhe'n rud colainn gun cheann a' falbh feadh siod.",
		"agus bha bodach a' fuireach ann a' sabhall.",
		"Chuir iad duine ann a' sabhall a dh' fhuireach oidhche.",
		"agus chunnaic e am bòcan a bha seo agus an bòcan bhitheadh aige.",
		"agus tha obair uamhasach aige mun d' fhuair e am bòcan a chumail bhuaidh.",
		"agus bha coltas air gun deànadh am bòcan an gróthach air.",
		"Cha robh buille a bhuaileadh e air nach robh e a' smaoineach' gur h- ann air póca cloìmh leis cho bog 's a bha a' bhuille is cha robh i a' dèanadh feum.",
	];
	res.json(text);
});

export default router;
