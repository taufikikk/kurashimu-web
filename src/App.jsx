import { useState, useEffect, useRef, useCallback, useMemo } from "react";

/* ═══════════════════════════════════════════════════════════════
   暮らシム — Kurashimu: Life Sim Japanese Learning App
   ═══════════════════════════════════════════════════════════════ */

// ── Golden Example Scene Data ──────────────────────────────────
const KONBINI_01 = {"_flags_documentation":{"flags_set_in_scene":["life_declined_point_card","life_accepted_point_card"],"flags_checked":[],"notes":"Only one of the two flags will be set depending on player choice at c4."},"scene_id":"konbini_01","title":"コンビニで初めてのお会計","title_reading":"こんびにではじめてのおかいけい","title_id":"Pertama kali bayar di konbini","description":"Malam pertama di Jepang. Pergi ke konbini dekat apartemen untuk beli makan malam. Semua serba baru.","level":"N4","phase":2,"setting":"Malam hari jam 9, Lawson dekat apartemen baru di Koenji. Tenang, cuma kamu dan satu kasir.","theme_color":"#1a1a2e","situation_tags":["belanja","konbini","pembayaran","menolak tawaran"],"anchor_phrases_used":["大丈夫です","お願いします"],"characters":[{"id":"clerk","name":"店員","name_reading":"てんいん","color":"#4fc3f7","role":"Kasir konbini, perempuan, 20-an, ramah dan sabar"}],"nodes":[{"id":"atm_01","type":"dialog","speaker":null,"subtype":"atmosphere","text":"夜の高円寺。静かな住宅街に、コンビニの明かりがぽつんと光っている。自動ドアが開くと、冷房と店内BGMが体を包む。","text_reading":"よるのこうえんじ。しずかなじゅうたくがいに、こんびにのあかりがぽつんとひかっている。じどうどあがあくと、れいぼうとてんないBGMがからだをつつむ。","translation_id":"Malam di Koenji. Di perumahan yang sepi, cahaya konbini menyala sendirian. Pintu otomatis terbuka, AC dan BGM toko menyambut.","translation_en":"Night in Koenji. In the quiet residential area, the convenience store light glows alone. The automatic door opens, and the air conditioning and store BGM wrap around you.","mood":"lonely","ambient":"Jingle pintu konbini, BGM samar, dengungan kulkas","grammar":[],"vocab":[{"word":"住宅街","reading":"じゅうたくがい","meaning_id":"perumahan / kawasan residensial","meaning_en":"residential area"}],"next":"n1"},{"id":"n1","type":"dialog","speaker":null,"subtype":"narration","text":"お弁当と飲み物を持ってレジに向かう。手が少し震えている。日本に来て初めての買い物だ。","text_reading":"おべんとうとのみものをもってれじにむかう。てがすこしふるえている。にほんにきてはじめてのかいものだ。","translation_id":"Membawa bento dan minuman menuju kasir. Tangan sedikit gemetar. Ini belanja pertama sejak datang ke Jepang.","translation_en":"Carrying a bento and drink toward the register. Hands trembling slightly. This is the first purchase since coming to Japan.","grammar":[{"pattern":"〜に向かう","meaning":"Menuju ke suatu tempat/arah. 向かう lebih spesifik dari 行く — ada nuansa 'sedang dalam perjalanan ke'.","jlpt":"N3"}],"vocab":[{"word":"レジ","reading":"れじ","meaning_id":"kasir / mesin kasir","meaning_en":"cash register"},{"word":"震える","reading":"ふるえる","meaning_id":"gemetar / bergetar","meaning_en":"to tremble / to shake"}],"next":"n2"},{"id":"n2","type":"dialog","speaker":"clerk","subtype":"speech","text":"いらっしゃいませ。袋はご利用になりますか？","text_reading":"いらっしゃいませ。ふくろはごりようになりますか？","translation_id":"Selamat datang. Apakah Anda mau pakai kantong?","translation_en":"Welcome. Would you like a bag?","grammar":[{"pattern":"ご〜になる","meaning":"Bentuk sonkeigo (menghormati lawan bicara). Kasir meninggikan tindakan customer. ご利用になる = versi sopan dari 使う.","jlpt":"N3"}],"vocab":[{"word":"袋","reading":"ふくろ","meaning_id":"kantong / tas plastik","meaning_en":"bag / plastic bag"},{"word":"利用","reading":"りよう","meaning_id":"menggunakan / memakai (formal)","meaning_en":"to use / to utilize"}],"next":"inner_01"},{"id":"inner_01","type":"dialog","speaker":null,"subtype":"inner_monologue","text":"袋はご利用になりますか…。袋…ふくろ…ビニール袋のことだよな。ご利用…利用する…使うってことか。つまり、袋いるかって聞いてる。いらないけど…なんて言えば…","text_reading":"ふくろはごりようになりますか…。ふくろ…ふくろ…びにーるぶくろのことだよな。ごりよう…りようする…つかうってことか。つまり、ふくろいるかってきいてる。いらないけど…なんていえば…","translation_id":"Fukuro wa goriyou ni narimasu ka... Fukuro... kantong plastik maksudnya kan. Goriyou... riyou suru... artinya pakai. Jadi dia nanya mau kantong atau nggak. Aku nggak mau sih... tapi gimana bilangnya...","translation_en":"Fukuro wa goriyou ni narimasu ka... Fukuro... she means plastic bag, right. Goriyou... riyou suru... means to use. So she's asking if I want a bag. I don't... but how do I say that...","grammar":[],"vocab":[],"next":"c1"},{"id":"c1","type":"choice","prompt":"Kasir bertanya apakah kamu mau kantong plastik (berbayar 3-5 yen). Jawab apa?","options":[{"text":"大丈夫です。","text_reading":"だいじょうぶです。","translation_id":"Tidak usah.","next":"n3a","feedback":"Natural dan sopan! 大丈夫です adalah cara paling umum menolak tawaran di konbini. Ini anchor phrase — ingat baik-baik, kamu akan pakai ini ratusan kali.","score":3,"flags_set":[]},{"text":"いりません！","text_reading":"いりません！","translation_id":"Nggak butuh!","next":"n3b","feedback":"Grammar benar, tapi terlalu blak-blakan. Di konbini, 大丈夫です lebih natural dan lebih lembut.","score":1,"flags_set":[]},{"text":"はい、お願いします。","text_reading":"はい、おねがいします。","translation_id":"Iya, tolong.","next":"n3c","feedback":"Sopan, natural, jelas. Kalau memang butuh kantong, ini jawaban sempurna.","score":3,"flags_set":[]}]},{"id":"n3a","type":"dialog","speaker":"clerk","subtype":"speech","text":"かしこまりました。お箸はお付けしますか？","text_reading":"かしこまりました。おはしはおつけしますか？","translation_id":"Baik. Apakah perlu sumpit?","translation_en":"Understood. Shall I include chopsticks?","grammar":[{"pattern":"かしこまりました","meaning":"Versi sangat sopan dari わかりました. Hanya dipakai oleh staff ke customer. Kamu TIDAK pakai ini ke orang lain.","jlpt":"N3"},{"pattern":"お〜する","meaning":"Bentuk kenjougo (merendahkan diri). お付けする = 'saya tambahkan (untuk Anda)'. Kebalikan dari ご〜になる.","jlpt":"N3"}],"vocab":[{"word":"お箸","reading":"おはし","meaning_id":"sumpit (sopan)","meaning_en":"chopsticks (polite)"}],"next":"inner_02"},{"id":"n3b","type":"dialog","speaker":"clerk","subtype":"speech","text":"…はい。お箸はお付けしますか？","text_reading":"…はい。おはしはおつけしますか？","translation_id":"...Baik. Apakah perlu sumpit?","translation_en":"...Okay. Shall I include chopsticks?","grammar":[{"pattern":"お〜する","meaning":"Bentuk kenjougo (merendahkan diri). お付けする = 'saya tambahkan (untuk Anda)'.","jlpt":"N3"}],"vocab":[{"word":"お箸","reading":"おはし","meaning_id":"sumpit (sopan)","meaning_en":"chopsticks (polite)"}],"pacing":{"text_speed":"slow","pause_after_ms":500},"next":"inner_02"},{"id":"n3c","type":"dialog","speaker":"clerk","subtype":"speech","text":"はい、袋は3円になります。お箸はお付けしますか？","text_reading":"はい、ふくろは3えんになります。おはしはおつけしますか？","translation_id":"Baik, kantongnya 3 yen. Apakah perlu sumpit?","translation_en":"Sure, the bag is 3 yen. Shall I include chopsticks?","grammar":[{"pattern":"〜になります","meaning":"Dalam konteks harga: 'totalnya / harganya'. Bukan 'berubah menjadi' — ini cara sopan menyatakan harga.","jlpt":"N4"}],"vocab":[],"next":"inner_02"},{"id":"inner_02","type":"dialog","speaker":null,"subtype":"inner_monologue","text":"お箸…おはし…chopsticks か。お弁当買ったし、箸はいるよな。なんて言おう。","text_reading":"おはし…おはし…ちょっぷすてぃっくすか。おべんとうかったし、はしはいるよな。なんていおう。","translation_id":"Ohashi... ohashi... sumpit ya. Aku beli bento, jadi butuh sumpit. Bilang apa ya.","translation_en":"Ohashi... ohashi... chopsticks. I bought a bento, so I need chopsticks. What should I say.","grammar":[],"vocab":[],"next":"c2"},{"id":"c2","type":"choice","prompt":"Kasir tanya soal sumpit. Kamu beli bento jadi butuh sumpit.","options":[{"text":"はい、お願いします。","text_reading":"はい、おねがいします。","translation_id":"Iya, tolong.","next":"n4","feedback":"Simpel, sopan, jelas. お願いします itu anchor phrase — kapan aja mau minta sesuatu, ini selalu works.","score":3,"flags_set":[]},{"text":"箸、ください。","text_reading":"はし、ください。","translation_id":"Sumpit, tolong.","next":"n4","feedback":"Bisa dimengerti, tapi terlalu abrupt. Dan kamu lupa お di depan 箸 — di konbini biasanya pakai お箸. Tapi kasir tetap ngerti kok.","score":2,"flags_set":[]}]},{"id":"n4","type":"dialog","speaker":"clerk","subtype":"speech","text":"はい。温めますか？","text_reading":"はい。あたためますか？","translation_id":"Baik. Mau dipanasin?","translation_en":"Sure. Would you like it heated?","grammar":[],"vocab":[{"word":"温める","reading":"あたためる","meaning_id":"memanaskan / menghangatkan","meaning_en":"to heat up / to warm"}],"checkpoint":true,"next":"inner_03"},{"id":"inner_03","type":"dialog","speaker":null,"subtype":"inner_monologue","text":"温め…あたため…あ、温めるだ。お弁当を温めるかって。冷たいお弁当は嫌だし、温めてもらおう。","text_reading":"あたため…あたため…あ、あたためるだ。おべんとうをあたためるかって。つめたいおべんとうはいやだし、あたためてもらおう。","translation_id":"Atatame... atatame... ah, atatameru. Dia tanya mau bento dipanasin. Bento dingin nggak enak, minta panasin aja deh.","translation_en":"Atatame... atatame... ah, atatameru. She's asking if I want the bento heated. Cold bento isn't great, let's ask her to heat it.","grammar":[],"vocab":[],"next":"c3"},{"id":"c3","type":"choice","prompt":"Kasir tanya mau dipanasin. Bento dingin sih.","options":[{"text":"はい、お願いします。","text_reading":"はい、おねがいします。","translation_id":"Iya, tolong.","next":"n5_heat","feedback":"Lagi-lagi お願いします. Kamu mulai sadar — frasa ini bisa dipakai di mana aja kalau mau minta sesuatu.","score":3,"flags_set":[]},{"text":"あ、大丈夫です。そのままで。","text_reading":"あ、だいじょうぶです。そのままで。","translation_id":"Ah, nggak usah. Biarkan begitu aja.","next":"n5_noheat","feedback":"Natural! そのままで ('biarkan apa adanya') sangat umum di konbini. Dan 大丈夫です lagi — senjata utamamu.","score":3,"flags_set":[]},{"text":"いいえ。","text_reading":"いいえ。","translation_id":"Tidak.","next":"n5_noheat","feedback":"Artinya benar, tapi いいえ sendirian terdengar kaku. Tambahkan 大丈夫です supaya lebih natural.","score":1,"flags_set":[]}]},{"id":"n5_heat","type":"dialog","speaker":"clerk","subtype":"speech","text":"少々お待ちください。","text_reading":"しょうしょうおまちください。","translation_id":"Mohon tunggu sebentar.","translation_en":"Please wait a moment.","grammar":[{"pattern":"少々お待ちください","meaning":"Mohon tunggu sebentar (sopan). 少々 = sedikit (formal). Versi casual: ちょっと待ってください.","jlpt":"N3"}],"vocab":[],"next":"n5_heat_wait"},{"id":"n5_heat_wait","type":"dialog","speaker":null,"subtype":"narration","text":"店員がお弁当を電子レンジに入れる。ブーンという音。30秒ほど待つ。","text_reading":"てんいんがおべんとうをでんしれんじにいれる。ぶーんというおと。30びょうほどまつ。","translation_id":"Kasir memasukkan bento ke microwave. Bunyi dengung. Menunggu sekitar 30 detik.","translation_en":"The clerk puts the bento in the microwave. A humming sound. About 30 seconds of waiting.","grammar":[],"vocab":[{"word":"電子レンジ","reading":"でんしれんじ","meaning_id":"microwave","meaning_en":"microwave oven"}],"next":"n6"},{"id":"n5_noheat","type":"dialog","speaker":"clerk","subtype":"speech","text":"はい。ポイントカードはお持ちですか？","text_reading":"はい。ぽいんとかーどはおもちですか？","translation_id":"Baik. Apakah Anda punya kartu poin?","translation_en":"Sure. Do you have a point card?","grammar":[{"pattern":"お持ちですか","meaning":"Bentuk sonkeigo dari 持っていますか (apakah punya). お持ち = honorific.","jlpt":"N3"}],"vocab":[{"word":"ポイントカード","reading":"ぽいんとかーど","meaning_id":"kartu poin / kartu member","meaning_en":"point card / loyalty card"}],"next":"inner_04"},{"id":"n6","type":"dialog","speaker":"clerk","subtype":"speech","text":"お待たせしました。ポイントカードはお持ちですか？","text_reading":"おまたせしました。ぽいんとかーどはおもちですか？","translation_id":"Maaf menunggu. Apakah Anda punya kartu poin?","translation_en":"Sorry for the wait. Do you have a point card?","grammar":[{"pattern":"お待たせしました","meaning":"Maaf sudah membuat menunggu. Kenjougo. Standar setelah customer menunggu.","jlpt":"N3"}],"vocab":[],"next":"inner_04"},{"id":"inner_04","type":"dialog","speaker":null,"subtype":"inner_monologue","text":"ポイントカード？ああ、kartu poin か。まだ持ってない。日本に来たばかりだし。でも…なんて説明しよう。「ない」だけじゃ冷たいかな…","text_reading":"ぽいんとかーど？ああ、かるとぽいんか。まだもっていない。にほんにきたばかりだし。でも…なんてせつめいしよう。「ない」だけじゃつめたいかな…","translation_id":"Point card? Oh, kartu poin. Belum punya. Baru aja datang ke Jepang. Tapi... gimana jelasinnya ya. Cuma bilang 'nggak ada' terlalu dingin kali...","translation_en":"Point card? Oh, a loyalty card. Don't have one yet. Just arrived in Japan after all. But... how do I explain. Just saying 'don't have one' might be too cold...","grammar":[{"pattern":"〜たばかり","meaning":"Baru saja melakukan sesuatu. 来たばかり = baru saja datang. Sangat baru.","jlpt":"N4"}],"vocab":[],"next":"c4"},{"id":"c4","type":"choice","prompt":"Kasir tanya kartu poin tapi kamu belum punya.","options":[{"text":"持っていないです。","text_reading":"もっていないです。","translation_id":"Saya tidak punya.","next":"n7_total","feedback":"Simpel, jelas, sopan. Perfectly fine.","score":3,"flags_set":["life_declined_point_card"]},{"text":"ないです。","text_reading":"ないです。","translation_id":"Nggak ada.","next":"n7_total","feedback":"Singkat dan dimengerti. Agak casual tapi acceptable di konbini.","score":2,"flags_set":["life_declined_point_card"]},{"text":"あ、すみません。まだ作っていないんです。","text_reading":"あ、すみません。まだつくっていないんです。","translation_id":"Ah, maaf. Saya belum bikin.","next":"n7_nice","feedback":"Sangat natural! すみません = sopan, まだ作っていない = belum bikin (jujur), んです = nuansa penjelasan. Native-like response.","score":3,"flags_set":["life_declined_point_card"]}]},{"id":"n7_nice","type":"dialog","speaker":"clerk","subtype":"speech","text":"大丈夫ですよ。よろしければ、こちらで作れますよ。","text_reading":"だいじょうぶですよ。よろしければ、こちらでつくれますよ。","translation_id":"Tidak apa-apa kok. Kalau mau, bisa bikin di sini.","translation_en":"That's fine. If you'd like, you can make one here.","grammar":[{"pattern":"よろしければ","meaning":"Kalau berkenan / kalau tidak keberatan. Versi sopan dari よかったら.","jlpt":"N3"}],"vocab":[],"next":"n7_nice_reply"},{"id":"n7_nice_reply","type":"dialog","speaker":null,"subtype":"inner_monologue","text":"作れる…ここで作れるのか。でも今日はもう頭がいっぱいだ。また今度にしよう。","text_reading":"つくれる…ここでつくれるのか。でもきょうはもうあたまがいっぱいだ。またこんどにしよう。","translation_id":"Bisa bikin... bisa bikin di sini ternyata. Tapi hari ini otakku udah penuh. Lain kali aja deh.","translation_en":"Can make one... so I can make one here. But my head is already full today. Let's do it another time.","grammar":[],"vocab":[],"next":"n7_nice_decline"},{"id":"n7_nice_decline","type":"dialog","speaker":null,"subtype":"narration","text":"「また今度お願いします」と言って軽く頭を下げた。","text_reading":"「またこんどおねがいします」といってかるくあたまをさげた。","translation_id":"Kamu bilang 'lain kali ya' sambil sedikit menundukkan kepala.","translation_en":"You said 'next time please' with a slight bow.","grammar":[{"pattern":"また今度","meaning":"Lain kali. Bisa betulan lain kali, atau sekedar penolakan halus.","jlpt":"N4"}],"vocab":[],"next":"n7_total"},{"id":"n7_total","type":"dialog","speaker":"clerk","subtype":"speech","text":"お会計は648円になります。","text_reading":"おかいけいは648えんになります。","translation_id":"Totalnya 648 yen.","translation_en":"Your total is 648 yen.","grammar":[],"vocab":[{"word":"お会計","reading":"おかいけい","meaning_id":"total pembayaran (sopan)","meaning_en":"bill / total (polite)"}],"next":"n8"},{"id":"n8","type":"dialog","speaker":null,"subtype":"narration","text":"財布から1000円札を出す。他に小銭がない。","text_reading":"さいふから1000えんさつをだす。ほかにこぜにがない。","translation_id":"Keluarkan uang kertas 1000 yen dari dompet. Nggak ada uang receh lain.","translation_en":"Take out a 1000 yen bill from the wallet. No other coins.","grammar":[],"vocab":[{"word":"財布","reading":"さいふ","meaning_id":"dompet","meaning_en":"wallet"},{"word":"小銭","reading":"こぜに","meaning_id":"uang receh / koin","meaning_en":"small change / coins"}],"next":"n9"},{"id":"n9","type":"dialog","speaker":"clerk","subtype":"speech","text":"1000円お預かりします。352円のお返しになります。","text_reading":"1000えんおあずかりします。352えんのおかえしになります。","translation_id":"Saya terima 1000 yen. Kembaliannya 352 yen.","translation_en":"I'll take 1000 yen. Your change is 352 yen.","grammar":[{"pattern":"お預かりします","meaning":"Saya terima (uang). Literally 'saya simpan sementara'. Kenjougo — kasir merendahkan diri. Standar di semua toko.","jlpt":"N3"},{"pattern":"お返し","meaning":"Kembalian. Bentuk sopan. Di kasir: お返しになります = 'kembaliannya adalah'.","jlpt":"N3"}],"vocab":[{"word":"お釣り","reading":"おつり","meaning_id":"uang kembalian","meaning_en":"change (money)","anime_bridge":"Di anime kadang muncul saat karakter belanja. Di real life, kamu dengar ini SETIAP kali bayar pakai cash."}],"checkpoint":true,"next":"n10"},{"id":"n10","type":"dialog","speaker":"clerk","subtype":"speech","text":"レシートはご利用ですか？","text_reading":"れしーとはごりようですか？","translation_id":"Apakah perlu struk?","translation_en":"Would you like the receipt?","grammar":[],"vocab":[{"word":"レシート","reading":"れしーと","meaning_id":"struk / bon belanja","meaning_en":"receipt"}],"next":"inner_05"},{"id":"inner_05","type":"dialog","speaker":null,"subtype":"inner_monologue","text":"レシート。struk か。いらないかな。また「大丈夫です」って言えばいいか。…このフレーズ、便利すぎないか？","text_reading":"れしーと。すとるくか。いらないかな。また「だいじょうぶです」っていえばいいか。…このふれーず、べんりすぎないか？","translation_id":"Receipt. Struk ya. Nggak perlu kayaknya. Bilang 'daijoubu desu' lagi aja. ...Frasa ini terlalu berguna nggak sih?","translation_en":"Receipt. A receipt huh. Don't really need it. Just say 'daijoubu desu' again. ...Isn't this phrase way too useful?","grammar":[],"vocab":[],"next":"c5"},{"id":"c5","type":"choice","prompt":"Kasir tanya soal struk. Bento biasa, nggak perlu struk.","options":[{"text":"大丈夫です。","text_reading":"だいじょうぶです。","translation_id":"Tidak usah.","next":"n11","feedback":"Ketiga kalinya 大丈夫です di scene ini! Kamu mulai paham — ini swiss army knife-nya percakapan konbini.","score":3,"flags_set":[]},{"text":"はい、ください。","text_reading":"はい、ください。","translation_id":"Iya, tolong.","next":"n11","feedback":"Boleh juga. Simpan struk itu kebiasaan bagus buat tracking pengeluaran.","score":3,"flags_set":[]}]},{"id":"n11","type":"dialog","speaker":"clerk","subtype":"speech","text":"ありがとうございました。またお越しくださいませ。","text_reading":"ありがとうございました。またおこしくださいませ。","translation_id":"Terima kasih banyak. Silakan datang lagi.","translation_en":"Thank you very much. Please come again.","grammar":[{"pattern":"お越しくださいませ","meaning":"Silakan datang (sangat sopan). お越し = sonkeigo dari 来る. くださいませ = lebih sopan dari ください. Hanya staff ke customer.","jlpt":"N2"}],"vocab":[],"next":"n12"},{"id":"n12","type":"dialog","speaker":null,"subtype":"narration","text":"お弁当と飲み物を持って店を出る。自動ドアが閉まる。夜の空気が顔に当たる。","text_reading":"おべんとうとのみものをもってみせをでる。じどうどあがしまる。よるのくうきがかおにあたる。","translation_id":"Keluar toko membawa bento dan minuman. Pintu otomatis menutup. Udara malam menerpa wajah.","translation_en":"Leaving the store with bento and drink. The automatic door closes. The night air hits your face.","grammar":[],"vocab":[],"next":"story_01"},{"id":"story_01","type":"dialog","speaker":null,"subtype":"inner_monologue","mood":"relieved","text":"…できた。なんとかできた。\n\nたかがコンビニの買い物。でも、今の自分にはこれが精一杯だ。\n\n温かいお弁当を持つ手が、さっきより震えていない。\n\n明日もここに来よう。","text_reading":"…できた。なんとかできた。\n\nたかがこんびにのかいもの。でも、いまのじぶんにはこれがせいいっぱいだ。\n\nあたたかいおべんとうをもつてが、さっきよりふるえていない。\n\nあしたもここにこよう。","translation_id":"...Berhasil. Entah gimana, berhasil.\n\nCuma belanja di konbini. Tapi untuk diriku sekarang, ini sudah semampunya.\n\nTangan yang memegang bento hangat, nggak gemetar lagi seperti tadi.\n\nBesok ke sini lagi.","translation_en":"...I did it. Somehow, I did it.\n\nIt's just convenience store shopping. But for who I am right now, this is my best.\n\nThe hand holding the warm bento isn't trembling like before.\n\nI'll come here again tomorrow.","pacing":{"text_speed":"slow","pause_after_ms":2000},"grammar":[],"vocab":[],"next":"end_check"},{"id":"end_check","type":"dialog","speaker":null,"subtype":"narration","text":"","text_reading":"","translation_id":"","translation_en":"","grammar":[],"vocab":[],"next":"end_good"},{"id":"end_good","type":"ending","variant":"good","text":"Belanja pertama di konbini berhasil lancar. Kasir bahkan nawarin bikin point card — berarti kamu kedengarannya cukup natural. Langkah kecil, tapi langkah pertama. Besok mungkin coba beli onigiri dan tanya isinya apa.","total_score_min":12},{"id":"end_neutral","type":"ending","variant":"neutral","text":"Belanja selesai. Ada beberapa momen kaku, tapi kasirnya sabar dan transaksi tetap jalan. Kamu belajar satu hal penting hari ini: 大丈夫です bisa menyelamatkanmu dari hampir semua situasi di konbini.","total_score_min":8},{"id":"end_bad","type":"ending","variant":"bad","text":"Transaksi selesai tapi canggung. Kasir sempat ragu beberapa kali, antrian di belakang mulai terbentuk. Kamu buru-buru keluar, jantung masih deg-degan. Tapi kamu KELUAR DENGAN BENTO DI TANGAN. Itu yang penting. Besok coba lagi — dan besok pasti lebih baik.","total_score_min":0}],"review":{"vocab_list":["袋","利用","お箸","温める","電子レンジ","お会計","お預かり","お返し","お釣り","レシート","財布","小銭"],"grammar_list":["ご〜になる","お〜する","かしこまりました","大丈夫です (penolakan)","〜たばかり","お持ちですか","お越しくださいませ"],"quiz":[{"type":"pick_correct","question":"Cara paling natural menolak tawaran di konbini?","options":["いりません","大丈夫です","いいえ","だめです"],"answer":1,"explanation":"大丈夫です adalah cara paling umum dan natural. Sopan tapi nggak kaku."},{"type":"pick_correct","question":"「かしこまりました」dipakai oleh siapa ke siapa?","options":["Customer ke staff","Staff ke customer","Teman ke teman","Siapa saja"],"answer":1,"explanation":"Hanya staff/pelayan yang pakai ke customer. Bentuk sangat sopan dari わかりました."},{"type":"translate","prompt":"袋はご利用になりますか？","acceptable":["Apakah Anda mau pakai kantong?","Would you like a bag?","Mau pakai kantong?"],"explanation":"ご利用になる = sonkeigo dari 利用する/使う."},{"type":"fill_blank","sentence":"1000円___します。","options":["お預かり","お返し","お会計","お釣り"],"answer":0,"explanation":"お預かりします = saya terima (uang Anda). Standar kasir saat menerima pembayaran."},{"type":"pick_correct","question":"「そのままで」artinya?","options":["Tolong ganti","Biarkan seperti ini saja","Tolong bungkus","Saya mau baru"],"answer":1,"explanation":"そのままで = biarkan apa adanya. Sering dipakai menolak pemanasan bento."},{"type":"reorder","question":"Susun kata berikut menjadi kalimat yang benar:","words":["になりますか？","袋は","ご利用"],"correct":["袋は","ご利用","になりますか？"],"explanation":"袋はご利用になりますか？ = Apakah Anda mau pakai kantong? Urutan: topik (袋は) + sonkeigo verb (ご利用になる) + question (か)."}]}};

// ── Utilities ──────────────────────────────────────────────────
const getNode = (nodes, id) => nodes.find(n => n.id === id);
const replName = (t, name) => t ? t.replace(/\{player_name\}/g, name).replace(/\{player_name_katakana\}/g, name) : t;

// Backend API
const API_BASE = "https://web-production-8fbf6.up.railway.app";

function determineEnding(nodes, score) {
  const endings = nodes.filter(n => n.type === "ending").sort((a, b) => (b.total_score_min || 0) - (a.total_score_min || 0));
  for (const e of endings) {
    if (score >= (e.total_score_min || 0)) return e;
  }
  return endings[endings.length - 1];
}

function getCharacter(characters, id) {
  return characters.find(c => c.id === id);
}

// ── Styles ─────────────────────────────────────────────────────
const S = {
  // Root
  root: { height: "100vh", background: "#08080f", color: "#e8e6e3", fontFamily: "'Noto Sans JP', 'Hiragino Kaku Gothic Pro', sans-serif", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" },

  // Title screen
  title: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem", textAlign: "center", background: "radial-gradient(ellipse at 50% 30%, #12122a 0%, #08080f 70%)" },
  titleMain: { fontSize: "2.8rem", fontWeight: 300, letterSpacing: "0.15em", marginBottom: "0.25rem", background: "linear-gradient(135deg, #c9b8ff 0%, #7eb8ff 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  titleSub: { fontSize: "0.95rem", color: "#6a6a8a", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "3rem" },
  input: { background: "transparent", border: "1px solid #2a2a4a", borderRadius: "6px", padding: "0.7rem 1.2rem", color: "#e8e6e3", fontSize: "1.1rem", textAlign: "center", width: "260px", outline: "none", marginBottom: "0.5rem", fontFamily: "inherit" },
  inputLabel: { fontSize: "0.8rem", color: "#5a5a7a", marginBottom: "1.5rem" },
  btn: { background: "linear-gradient(135deg, #2a2a5a 0%, #1a1a3e 100%)", border: "1px solid #3a3a6a", borderRadius: "8px", padding: "0.8rem 2.5rem", color: "#c9c0ff", fontSize: "1rem", cursor: "pointer", letterSpacing: "0.1em", transition: "all 0.2s", fontFamily: "inherit" },
  btnHover: { borderColor: "#6a6aaa", background: "linear-gradient(135deg, #3a3a6a 0%, #2a2a5a 100%)" },

  // Game screen
  game: { flex: 1, display: "flex", flexDirection: "column", position: "relative" },
  sceneArea: { flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "1rem", paddingBottom: "0" },

  // Top bar
  topBar: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.6rem 1rem", borderBottom: "1px solid #1a1a2e", background: "#0a0a14", flexShrink: 0, zIndex: 10 },
  topTitle: { fontSize: "0.85rem", color: "#7a7a9a", letterSpacing: "0.05em" },
  topBtns: { display: "flex", gap: "0.5rem" },
  topBtn: { background: "none", border: "1px solid #2a2a4a", borderRadius: "4px", padding: "0.3rem 0.7rem", color: "#8a8aaa", fontSize: "0.75rem", cursor: "pointer", transition: "all 0.15s", fontFamily: "inherit" },

  // Dialog box
  dialogBox: { background: "linear-gradient(180deg, rgba(12,12,24,0.95) 0%, rgba(8,8,16,0.98) 100%)", borderTop: "1px solid #1e1e3a", padding: "1.2rem 1.5rem", minHeight: "180px", cursor: "pointer", position: "relative", flexShrink: 0 },
  speaker: { fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.5rem", letterSpacing: "0.05em" },
  dialogText: { fontSize: "1.15rem", lineHeight: 1.9, letterSpacing: "0.02em" },
  reading: { fontSize: "0.78rem", color: "#6a7a9a", lineHeight: 1.7, marginTop: "0.4rem", fontStyle: "italic" },
  translation: { fontSize: "0.82rem", color: "#5a6a7a", lineHeight: 1.6, marginTop: "0.6rem", borderTop: "1px solid #1a1a2e", paddingTop: "0.5rem" },

  // Inner monologue
  innerText: { fontStyle: "italic", color: "#a8b8d8" },
  // Atmosphere
  atmosText: { color: "#7a8aaa", textAlign: "center", fontStyle: "italic", lineHeight: 2.2 },
  // Narration
  narrText: { color: "#9a9aba" },

  // Choice panel
  choicePanel: { padding: "1rem 1.5rem", background: "rgba(10,10,18,0.98)", borderTop: "1px solid #1e1e3a" },
  choicePrompt: { fontSize: "0.85rem", color: "#8a8aaa", marginBottom: "0.8rem", textAlign: "center" },
  choiceBtn: { display: "block", width: "100%", background: "rgba(25,25,50,0.8)", border: "1px solid #2a2a5a", borderRadius: "8px", padding: "0.9rem 1.2rem", color: "#d0d0f0", fontSize: "1rem", cursor: "pointer", marginBottom: "0.5rem", textAlign: "left", transition: "all 0.2s", fontFamily: "inherit", lineHeight: 1.6 },
  choiceSub: { fontSize: "0.78rem", color: "#6a6a8a", marginTop: "0.2rem" },

  // (feedback styles removed — now using non-blocking toast)

  // Backlog
  backlog: { position: "fixed", inset: 0, background: "rgba(6,6,12,0.97)", zIndex: 100, display: "flex", flexDirection: "column" },
  blogHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 1.5rem", borderBottom: "1px solid #1a1a2e" },
  blogTitle: { fontSize: "1rem", color: "#8a8aaa", letterSpacing: "0.1em" },
  blogBody: { flex: 1, overflowY: "auto", padding: "1rem 1.5rem" },
  blogEntry: { marginBottom: "1rem", paddingBottom: "0.8rem", borderBottom: "1px solid #0e0e1e" },
  blogSpeaker: { fontSize: "0.75rem", fontWeight: 600, marginBottom: "0.25rem" },
  blogText: { fontSize: "0.9rem", lineHeight: 1.7 },

  // Ending
  ending: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem", textAlign: "center", background: "radial-gradient(ellipse at 50% 40%, #0e0e20 0%, #08080f 70%)" },
  endLabel: { fontSize: "0.8rem", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "1rem" },
  endText: { fontSize: "1.05rem", lineHeight: 1.9, maxWidth: "500px", color: "#b0b0d0" },
  endScore: { marginTop: "1.5rem", fontSize: "0.9rem", color: "#6a6a8a" },

  // Review
  review: { flex: 1, display: "flex", flexDirection: "column", padding: "1.5rem", overflowY: "auto", background: "#08080f" },
  qCard: { background: "rgba(15,15,28,0.9)", border: "1px solid #1e1e3a", borderRadius: "8px", padding: "1.2rem", marginBottom: "1rem" },
  qNum: { fontSize: "0.75rem", color: "#5a5a7a", marginBottom: "0.5rem" },
  qText: { fontSize: "1rem", lineHeight: 1.6, marginBottom: "0.8rem" },
  qOpt: { display: "block", width: "100%", background: "rgba(20,20,40,0.8)", border: "1px solid #2a2a4a", borderRadius: "6px", padding: "0.6rem 1rem", color: "#c0c0e0", fontSize: "0.9rem", cursor: "pointer", marginBottom: "0.4rem", textAlign: "left", transition: "all 0.15s", fontFamily: "inherit" },

  // Vocab/Grammar tooltip
  annotation: { marginTop: "0.6rem", padding: "0.6rem 0.8rem", background: "rgba(20,25,40,0.9)", borderRadius: "6px", borderLeft: "2px solid #4a6aaa" },
  annWord: { fontSize: "0.85rem", color: "#8ab4ff", fontWeight: 600 },
  annMeaning: { fontSize: "0.8rem", color: "#7a8a9a", marginTop: "0.15rem" },
  annGrammar: { borderLeftColor: "#aa7aff" },
  annPattern: { fontSize: "0.85rem", color: "#b89aff", fontWeight: 600 },

  // Save slots
  savePanel: { position: "fixed", inset: 0, background: "rgba(6,6,12,0.97)", zIndex: 100, display: "flex", flexDirection: "column" },
  saveSlot: { background: "rgba(15,15,28,0.9)", border: "1px solid #1e1e3a", borderRadius: "8px", padding: "1rem", marginBottom: "0.6rem", cursor: "pointer", transition: "all 0.15s" },

  // Click indicator
  clickHint: { position: "absolute", bottom: "0.6rem", right: "1rem", fontSize: "0.7rem", color: "#3a3a5a", animation: "pulse 2s infinite" },
};

// ── Keyframes (inject once) ────────────────────────────────────
const styleTag = document.createElement("style");
styleTag.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;600&family=Zen+Kaku+Gothic+New:wght@300;400;500;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { margin: 0; background: #08080f; }
  @keyframes pulse { 0%,100%{opacity:0.3} 50%{opacity:0.8} }
  @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes glow { 0%,100%{box-shadow:0 0 8px rgba(100,140,255,0.15)} 50%{box-shadow:0 0 16px rgba(100,140,255,0.3)} }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #0a0a14; }
  ::-webkit-scrollbar-thumb { background: #2a2a4a; border-radius: 2px; }
  input::placeholder { color: #3a3a5a; }
`;
if (!document.getElementById("vn-styles")) { styleTag.id = "vn-styles"; document.head.appendChild(styleTag); }

// ── Typewriter Hook ────────────────────────────────────────────
function useTypewriter(text, speed = 30) {
  const [displayed, setDisplayed] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!text) { setDisplayed(0); setIsDone(true); return; }
    setDisplayed(0);
    setIsDone(false);
    const len = text.length;
    let i = 0;
    intervalRef.current = setInterval(() => {
      i++;
      setDisplayed(i);
      if (i >= len) {
        clearInterval(intervalRef.current);
        setIsDone(true);
      }
    }, speed);
    return () => clearInterval(intervalRef.current);
  }, [text, speed]);

  const skip = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setDisplayed(text ? text.length : 0);
    setIsDone(true);
  }, [text]);

  return { displayed, isDone, skip };
}

// ── Components ─────────────────────────────────────────────────

function TextWithAnnotations({ node, settings, playerName, typedChars, typingDone }) {
  const text = replName(node.text, playerName);
  const reading = replName(node.text_reading, playerName);
  const transId = replName(node.translation_id, playerName);
  const transEn = replName(node.translation_en, playerName);
  const hasEn = !!transEn;

  // Typewriter: show only typedChars characters of main text
  const visibleText = typedChars !== undefined && text ? text.slice(0, typedChars) : text;

  // Text chunking: split on \n
  const chunks = visibleText ? visibleText.split("\n") : [""];
  const readChunks = reading ? reading.split("\n").filter(Boolean) : [""];

  const subtypeStyle = node.subtype === "inner_monologue" ? S.innerText
    : node.subtype === "atmosphere" ? S.atmosText
    : node.subtype === "narration" ? S.narrText : {};

  return (
    <div>
      <div style={{ ...S.dialogText, ...subtypeStyle }}>
        {chunks.map((c, i) => <div key={i} style={{ marginBottom: i < chunks.length - 1 ? "0.6rem" : 0 }}>{c}<span style={{ opacity: 0.4, animation: !typingDone ? "pulse 0.8s infinite" : "none" }}>{!typingDone && i === chunks.length - 1 ? "▌" : ""}</span></div>)}
      </div>
      {/* Only show reading, translation, annotations after typing finishes */}
      {typingDone && settings.furigana && reading && (
        <div style={{ ...S.reading, animation: "fadeIn 0.3s ease" }}>{readChunks.map((c, i) => <div key={i}>{c}</div>)}</div>
      )}
      {typingDone && settings.translation !== "off" && (
        <div style={{ ...S.translation, animation: "fadeIn 0.3s ease" }}>
          {settings.translation === "id" && transId}
          {settings.translation === "en" && (hasEn ? transEn : transId)}
          {settings.translation === "both" && (
            <>
              <div>{transId}</div>
              {hasEn && <div style={{ marginTop: "0.2rem", color: "#4a5a6a" }}>{transEn}</div>}
            </>
          )}
        </div>
      )}
      {/* Vocab annotations */}
      {typingDone && node.vocab && node.vocab.length > 0 && settings.showAnnotations && (
        <div style={{ marginTop: "0.5rem", animation: "fadeIn 0.3s ease" }}>
          {node.vocab.map((v, i) => (
            <div key={i} style={S.annotation}>
              <div style={S.annWord}>{v.word}（{v.reading}）</div>
              <div style={S.annMeaning}>
                {settings.translation === "en" && v.meaning_en ? v.meaning_en : v.meaning_id}
                {v.anime_bridge && <span style={{ color: "#aa8855", marginLeft: "0.5rem" }}>🎌 {v.anime_bridge}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Grammar annotations */}
      {typingDone && node.grammar && node.grammar.length > 0 && settings.showAnnotations && (
        <div style={{ marginTop: "0.3rem", animation: "fadeIn 0.3s ease" }}>
          {node.grammar.map((g, i) => (
            <div key={i} style={{ ...S.annotation, ...S.annGrammar }}>
              <div style={S.annPattern}>{g.pattern} <span style={{ fontSize: "0.7rem", color: "#6a6a8a" }}>{g.jlpt}</span></div>
              <div style={S.annMeaning}>{g.meaning}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ChoicePanel({ node, settings, playerName, onChoice }) {
  const [hoveredIdx, setHoveredIdx] = useState(-1);
  return (
    <div style={{ ...S.choicePanel, animation: "slideUp 0.3s ease" }}>
      <div style={S.choicePrompt}>{node.prompt}</div>
      {node.options.map((opt, i) => (
        <button
          key={i}
          style={{
            ...S.choiceBtn,
            ...(hoveredIdx === i ? { borderColor: "#5a7aff", background: "rgba(40,50,90,0.6)", transform: "translateX(4px)" } : {}),
          }}
          onMouseEnter={() => setHoveredIdx(i)}
          onMouseLeave={() => setHoveredIdx(-1)}
          onClick={() => onChoice(i)}
        >
          <div style={{ fontSize: "1.05rem" }}>{opt.text}</div>
          {settings.furigana && opt.text_reading && (
            <div style={{ fontSize: "0.75rem", color: "#5a6a8a", marginTop: "0.15rem" }}>{opt.text_reading}</div>
          )}
          <div style={S.choiceSub}>{opt.translation_id}</div>
        </button>
      ))}
    </div>
  );
}

function ScoreToast({ option, visible }) {
  const scoreColor = option.score === 3 ? "#4ade80" : option.score === 2 ? "#facc15" : "#f87171";
  const scoreLabel = option.score === 3 ? "◎" : option.score === 2 ? "○" : "△";
  const shortFeedback = option.feedback_short || (option.feedback ? option.feedback.split(".")[0] + "." : "");
  if (!visible) return null;
  return (
    <div style={{
      position: "fixed", top: "3.5rem", right: "1rem", zIndex: 40,
      background: "rgba(10,10,20,0.95)", border: `1px solid ${scoreColor}44`,
      borderRadius: "8px", padding: "0.6rem 1rem", maxWidth: "280px",
      animation: "fadeIn 0.2s ease", boxShadow: `0 0 20px ${scoreColor}11`,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span style={{ fontSize: "1.2rem", color: scoreColor }}>{scoreLabel}</span>
        <span style={{ fontSize: "0.8rem", color: "#9a9aba", lineHeight: 1.4 }}>{shortFeedback}</span>
      </div>
      <div style={{ fontSize: "0.65rem", color: "#3a3a5a", marginTop: "0.3rem" }}>detail di backlog</div>
    </div>
  );
}

function BacklogPanel({ history, characters, settings, playerName, onClose }) {
  const bodyRef = useRef(null);
  useEffect(() => { if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight; }, []);
  return (
    <div style={S.backlog}>
      <div style={S.blogHeader}>
        <div style={S.blogTitle}>BACKLOG</div>
        <button style={S.topBtn} onClick={onClose}>✕ Close</button>
      </div>
      <div style={S.blogBody} ref={bodyRef}>
        {history.map((entry, i) => {
          const node = entry.node;
          if (!node || node.type !== "dialog" || !node.text) return null;
          const char = node.speaker ? getCharacter(characters, node.speaker) : null;
          const label = node.subtype === "inner_monologue" ? "💭" : node.subtype === "atmosphere" ? "🌙" : node.subtype === "narration" ? "📖" : char ? char.name : "";
          const color = char ? char.color : node.subtype === "inner_monologue" ? "#a8b8d8" : "#7a8a9a";
          return (
            <div key={i} style={S.blogEntry}>
              <div style={{ ...S.blogSpeaker, color }}>{label}</div>
              <div style={{ ...S.blogText, ...(node.subtype === "inner_monologue" ? { fontStyle: "italic", color: "#a8b8d8" } : node.subtype === "atmosphere" ? { color: "#7a8aaa", fontStyle: "italic" } : { color: "#c0c0d8" }) }}>
                {replName(node.text, playerName)}
              </div>
              {settings.furigana && node.text_reading && (
                <div style={{ fontSize: "0.7rem", color: "#4a5a6a", marginTop: "0.2rem" }}>{replName(node.text_reading, playerName)}</div>
              )}
              {entry.chosenOption && (
                <div style={{ marginTop: "0.4rem", paddingLeft: "0.8rem", borderLeft: "2px solid #3a5a8a" }}>
                  <div style={{ fontSize: "0.8rem", color: "#8ab4ff" }}>
                    ▸ {entry.chosenOption.text} <span style={{ color: "#5a6a7a" }}>({entry.chosenOption.translation_id})</span>
                  </div>
                  {entry.chosenOption.feedback && (
                    <div style={{ fontSize: "0.75rem", color: "#6a7a8a", marginTop: "0.3rem", lineHeight: 1.6, padding: "0.4rem 0.5rem", background: "rgba(15,20,35,0.5)", borderRadius: "4px" }}>
                      <span style={{ color: entry.chosenOption.score === 3 ? "#4ade80" : entry.chosenOption.score === 2 ? "#facc15" : "#f87171", marginRight: "0.4rem" }}>
                        {entry.chosenOption.score === 3 ? "◎" : entry.chosenOption.score === 2 ? "○" : "△"}
                      </span>
                      {entry.chosenOption.feedback}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SaveLoadPanel({ saves, mode, onSave, onLoad, onClose }) {
  const slots = [0, 1, 2];
  return (
    <div style={S.savePanel}>
      <div style={S.blogHeader}>
        <div style={S.blogTitle}>{mode === "save" ? "SAVE" : "LOAD"}</div>
        <button style={S.topBtn} onClick={onClose}>✕ Close</button>
      </div>
      <div style={{ flex: 1, padding: "1rem 1.5rem", overflowY: "auto" }}>
        {slots.map(i => {
          const s = saves[i];
          return (
            <div
              key={i}
              style={{ ...S.saveSlot, ...(s ? {} : { borderStyle: "dashed", opacity: mode === "load" && !s ? 0.4 : 1 }) }}
              onClick={() => {
                if (mode === "save") onSave(i);
                else if (s) onLoad(i);
              }}
            >
              <div style={{ fontSize: "0.8rem", color: "#6a6a8a", marginBottom: "0.3rem" }}>Slot {i + 1}</div>
              {s ? (
                <>
                  <div style={{ fontSize: "0.95rem", color: "#c0c0e0" }}>{s.sceneTitle}</div>
                  <div style={{ fontSize: "0.75rem", color: "#5a5a7a", marginTop: "0.2rem" }}>
                    Node: {s.nodeId} · Score: {s.score} · {new Date(s.savedAt).toLocaleString()}
                  </div>
                </>
              ) : (
                <div style={{ fontSize: "0.9rem", color: "#3a3a5a" }}>{mode === "save" ? "Tap untuk simpan" : "— kosong —"}</div>
              )}
            </div>
          );
        })}
        {mode === "save" && <div style={{ fontSize: "0.75rem", color: "#4a4a6a", marginTop: "0.5rem", textAlign: "center" }}>Save tersedia di checkpoint nodes</div>}
      </div>
    </div>
  );
}

// ── Reorder Quiz Component ─────────────────────────────────────
function ReorderQuestion({ words, correct, onAnswer, answered, showResults, isCorrect }) {
  const [selected, setSelected] = useState([]);
  const remaining = words.filter((_, i) => !selected.includes(i));

  const handleTap = (wordIdx) => {
    if (showResults) return;
    const newSelected = [...selected, wordIdx];
    setSelected(newSelected);
    if (newSelected.length === words.length) {
      onAnswer(newSelected.map(i => words[i]));
    }
  };

  const handleRemove = (pos) => {
    if (showResults) return;
    setSelected(prev => prev.filter((_, i) => i !== pos));
  };

  const handleReset = () => {
    if (showResults) return;
    setSelected([]);
  };

  return (
    <div>
      {/* Selected words (answer area) */}
      <div style={{
        minHeight: "2.8rem", padding: "0.5rem", background: "rgba(15,15,30,0.5)", borderRadius: "6px",
        border: `1px solid ${showResults ? (isCorrect ? "#4ade8044" : "#f8717144") : "#2a2a4a"}`,
        display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "0.6rem", alignItems: "center",
      }}>
        {selected.length === 0 && <span style={{ fontSize: "0.8rem", color: "#3a3a5a" }}>Tap kata di bawah untuk menyusun kalimat...</span>}
        {selected.map((wordIdx, pos) => (
          <button key={pos} onClick={() => handleRemove(pos)} style={{
            background: showResults ? (isCorrect ? "rgba(74,222,128,0.15)" : "rgba(248,113,113,0.15)") : "rgba(90,122,255,0.15)",
            border: `1px solid ${showResults ? (isCorrect ? "#4ade8044" : "#f8717144") : "#5a7aff44"}`,
            borderRadius: "4px", padding: "0.3rem 0.6rem", color: "#d0d0f0", fontSize: "0.9rem",
            cursor: showResults ? "default" : "pointer", fontFamily: "inherit",
          }}>
            {words[wordIdx]}
          </button>
        ))}
        {selected.length > 0 && !showResults && (
          <button onClick={handleReset} style={{ background: "none", border: "none", color: "#5a5a7a", fontSize: "0.7rem", cursor: "pointer", marginLeft: "auto", fontFamily: "inherit" }}>reset</button>
        )}
      </div>
      {/* Remaining words to pick */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
        {words.map((word, i) => {
          const isUsed = selected.includes(i);
          return (
            <button key={i} onClick={() => !isUsed && handleTap(i)} style={{
              background: isUsed ? "rgba(10,10,20,0.3)" : "rgba(25,25,50,0.8)",
              border: `1px solid ${isUsed ? "#1a1a2a" : "#2a2a5a"}`,
              borderRadius: "4px", padding: "0.35rem 0.7rem", fontSize: "0.9rem",
              color: isUsed ? "#2a2a4a" : "#c0c0e0", cursor: isUsed ? "default" : "pointer",
              transition: "all 0.15s", fontFamily: "inherit",
            }}>
              {word}
            </button>
          );
        })}
      </div>
      {/* Show correct answer after results */}
      {showResults && !isCorrect && (
        <div style={{ marginTop: "0.4rem", fontSize: "0.8rem", color: "#7aaa7a" }}>
          <span style={{ color: "#5a7a9a" }}>正解: </span>{correct.join("")}
        </div>
      )}
    </div>
  );
}

function ReviewScreen({ review, onFinish }) {
  const [showRecap, setShowRecap] = useState(true);
  const [answers, setAnswers] = useState({});
  const [textInputs, setTextInputs] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (qi, ai) => {
    if (showResults) return;
    setAnswers(prev => ({ ...prev, [qi]: ai }));
  };

  const handleTextInput = (qi, val) => {
    if (showResults) return;
    setTextInputs(prev => ({ ...prev, [qi]: val }));
    setAnswers(prev => ({ ...prev, [qi]: val }));
  };

  const handleReorderAnswer = (qi, orderedWords) => {
    if (showResults) return;
    setAnswers(prev => ({ ...prev, [qi]: orderedWords }));
  };

  // Fuzzy match for translate
  const isTranslateCorrect = (userInput, acceptable) => {
    if (!userInput || !acceptable) return false;
    const clean = s => s.toLowerCase().replace(/[?.!,]/g, "").trim();
    const input = clean(userInput);
    return acceptable.some(a => {
      const target = clean(a);
      if (input === target) return true;
      const targetWords = target.split(/\s+/);
      const matchCount = targetWords.filter(w => input.includes(w)).length;
      return matchCount >= Math.ceil(targetWords.length * 0.6);
    });
  };

  // Reorder match
  const isReorderCorrect = (userOrder, correct) => {
    if (!userOrder || !correct) return false;
    return JSON.stringify(userOrder) === JSON.stringify(correct);
  };

  const getQuizCorrect = (q, qi) => {
    if (answers[qi] === undefined) return null;
    if (q.type === "translate") return isTranslateCorrect(answers[qi], q.acceptable);
    if (q.type === "reorder") return isReorderCorrect(answers[qi], q.correct);
    return answers[qi] === q.answer;
  };

  const correctCount = review.quiz.reduce((acc, q, i) => {
    const result = getQuizCorrect(q, i);
    return result === true ? acc + 1 : acc;
  }, 0);

  const allAnswered = review.quiz.every((q, i) => {
    if (q.type === "translate") return textInputs[i] && textInputs[i].trim().length > 0;
    if (q.type === "reorder") return answers[i] !== undefined;
    return answers[i] !== undefined;
  });

  // ── Vocab/Grammar Recap ──
  if (showRecap) {
    const hasVocab = review.vocab_list && review.vocab_list.length > 0;
    const hasGrammar = review.grammar_list && review.grammar_list.length > 0;
    if (!hasVocab && !hasGrammar) {
      setShowRecap(false);
    }
    return (
      <div style={S.review}>
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "0.8rem", color: "#5a5a7a", letterSpacing: "0.2em", textTransform: "uppercase" }}>Review</div>
          <div style={{ fontSize: "1.2rem", color: "#a0a0c0", marginTop: "0.3rem" }}>今日の復習</div>
        </div>

        {hasVocab && (
          <div style={{ ...S.qCard, marginBottom: "1rem" }}>
            <div style={{ fontSize: "0.75rem", color: "#5a7a9a", marginBottom: "0.6rem", letterSpacing: "0.1em" }}>VOCAB</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
              {review.vocab_list.map((v, i) => (
                <span key={i} style={{
                  padding: "0.3rem 0.6rem", background: "rgba(90,122,255,0.1)", border: "1px solid #2a3a5a",
                  borderRadius: "4px", fontSize: "0.9rem", color: "#a0b0d0",
                }}>{v}</span>
              ))}
            </div>
          </div>
        )}

        {hasGrammar && (
          <div style={{ ...S.qCard, marginBottom: "1rem" }}>
            <div style={{ fontSize: "0.75rem", color: "#7a5a9a", marginBottom: "0.6rem", letterSpacing: "0.1em" }}>GRAMMAR</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
              {review.grammar_list.map((g, i) => (
                <span key={i} style={{
                  padding: "0.3rem 0.6rem", background: "rgba(140,90,255,0.1)", border: "1px solid #3a2a5a",
                  borderRadius: "4px", fontSize: "0.9rem", color: "#b0a0d0",
                }}>{g}</span>
              ))}
            </div>
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <button style={S.btn} onClick={() => setShowRecap(false)}>
            クイズを始める
          </button>
        </div>
      </div>
    );
  }

  // ── Quiz ──
  return (
    <div style={S.review}>
      <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: "0.8rem", color: "#5a5a7a", letterSpacing: "0.2em", textTransform: "uppercase" }}>Quiz</div>
        <div style={{ fontSize: "1.2rem", color: "#a0a0c0", marginTop: "0.3rem" }}>復習クイズ</div>
      </div>

      {review.quiz.map((q, qi) => {
        const answered = answers[qi] !== undefined;
        const isCorrect = getQuizCorrect(q, qi);
        const borderHighlight = showResults && answered ? { borderColor: isCorrect ? "#4ade8044" : "#f8717144" } : {};
        const typeLabel = q.type === "pick_correct" ? "Pilih jawaban"
          : q.type === "fill_blank" ? "Isi blank"
          : q.type === "reorder" ? "Susun kalimat"
          : "Terjemahkan";

        return (
          <div key={qi} style={{ ...S.qCard, ...borderHighlight }}>
            <div style={S.qNum}>Q{qi + 1} · {typeLabel}</div>
            <div style={S.qText}>{q.question || q.prompt || q.sentence}</div>

            {/* Multiple choice options (pick_correct & fill_blank) */}
            {q.type !== "translate" && q.type !== "reorder" && q.options && q.options.map((opt, oi) => {
              let optStyle = {};
              if (showResults && answered) {
                if (oi === q.answer) optStyle = { borderColor: "#4ade80", background: "rgba(74,222,128,0.1)", color: "#4ade80" };
                else if (oi === answers[qi] && oi !== q.answer) optStyle = { borderColor: "#f87171", background: "rgba(248,113,113,0.1)", color: "#f87171" };
              } else if (answers[qi] === oi) {
                optStyle = { borderColor: "#5a7aff", background: "rgba(90,122,255,0.1)" };
              }
              return (
                <button key={oi} style={{ ...S.qOpt, ...optStyle }} onClick={() => handleAnswer(qi, oi)}>
                  {opt}
                </button>
              );
            })}

            {/* Text input for translate type */}
            {q.type === "translate" && (
              <div>
                <input
                  style={{
                    width: "100%", background: "rgba(20,20,40,0.8)", border: `1px solid ${showResults ? (isCorrect ? "#4ade80" : "#f87171") : textInputs[qi] ? "#5a7aff" : "#2a2a4a"}`,
                    borderRadius: "6px", padding: "0.7rem 1rem", color: "#e0e0f0", fontSize: "0.95rem", fontFamily: "inherit", outline: "none",
                    transition: "border-color 0.2s",
                  }}
                  placeholder="Tulis terjemahannya..."
                  value={textInputs[qi] || ""}
                  onChange={e => handleTextInput(qi, e.target.value)}
                  disabled={showResults}
                />
                {showResults && (
                  <div style={{ marginTop: "0.4rem", fontSize: "0.8rem", color: "#6a8a6a" }}>
                    <span style={{ color: "#5a7a9a" }}>Jawaban yang diterima: </span>
                    {q.acceptable.map((a, i) => (
                      <span key={i} style={{ color: "#7aaa7a" }}>{i > 0 ? " / " : ""}{a}</span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Reorder type */}
            {q.type === "reorder" && (
              <ReorderQuestion
                words={q.words}
                correct={q.correct}
                onAnswer={(ordered) => handleReorderAnswer(qi, ordered)}
                answered={answered}
                showResults={showResults}
                isCorrect={isCorrect}
              />
            )}

            {showResults && answered && q.explanation && (
              <div style={{ marginTop: "0.5rem", fontSize: "0.82rem", color: "#8a9aba", padding: "0.5rem", background: "rgba(15,15,30,0.5)", borderRadius: "4px" }}>
                {q.explanation}
              </div>
            )}
          </div>
        );
      })}

      <div style={{ textAlign: "center", marginTop: "0.5rem", marginBottom: "1.5rem" }}>
        {!showResults ? (
          <button
            style={{ ...S.btn, opacity: allAnswered ? 1 : 0.4 }}
            onClick={() => setShowResults(true)}
            disabled={!allAnswered}
          >
            Cek Jawaban
          </button>
        ) : (
          <div>
            <div style={{ fontSize: "1.1rem", color: "#c0c8e0", marginBottom: "1rem" }}>
              {correctCount}/{review.quiz.length} benar
            </div>
            <button style={S.btn} onClick={onFinish}>Selesai</button>
          </div>
        )}
      </div>
    </div>
  );
}

function SettingsDrawer({ settings, onUpdate, onClose }) {
  return (
    <div style={{ ...S.savePanel }}>
      <div style={S.blogHeader}>
        <div style={S.blogTitle}>SETTINGS</div>
        <button style={S.topBtn} onClick={onClose}>✕ Close</button>
      </div>
      <div style={{ padding: "1.5rem" }}>
        {/* Furigana */}
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "0.8rem", color: "#6a6a8a", marginBottom: "0.5rem", letterSpacing: "0.1em" }}>FURIGANA</div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {[true, false].map(v => (
              <button key={String(v)} style={{ ...S.topBtn, ...(settings.furigana === v ? { borderColor: "#5a7aff", color: "#8aafff" } : {}) }}
                onClick={() => onUpdate({ ...settings, furigana: v })}>
                {v ? "ON" : "OFF"}
              </button>
            ))}
          </div>
        </div>
        {/* Translation */}
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "0.8rem", color: "#6a6a8a", marginBottom: "0.5rem", letterSpacing: "0.1em" }}>TERJEMAHAN</div>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {[["id","Indonesia"], ["en","English"], ["both","Both"], ["off","Off"]].map(([k, l]) => (
              <button key={k} style={{ ...S.topBtn, ...(settings.translation === k ? { borderColor: "#5a7aff", color: "#8aafff" } : {}) }}
                onClick={() => onUpdate({ ...settings, translation: k })}>
                {l}
              </button>
            ))}
          </div>
        </div>
        {/* Annotations */}
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "0.8rem", color: "#6a6a8a", marginBottom: "0.5rem", letterSpacing: "0.1em" }}>VOCAB & GRAMMAR NOTES</div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {[true, false].map(v => (
              <button key={String(v)} style={{ ...S.topBtn, ...(settings.showAnnotations === v ? { borderColor: "#5a7aff", color: "#8aafff" } : {}) }}
                onClick={() => onUpdate({ ...settings, showAnnotations: v })}>
                {v ? "Show" : "Hide"}
              </button>
            ))}
          </div>
        </div>
        {/* Text Speed */}
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "0.8rem", color: "#6a6a8a", marginBottom: "0.5rem", letterSpacing: "0.1em" }}>TEXT SPEED</div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {["slow","normal","fast"].map(v => (
              <button key={v} style={{ ...S.topBtn, ...(settings.textSpeed === v ? { borderColor: "#5a7aff", color: "#8aafff" } : {}) }}
                onClick={() => onUpdate({ ...settings, textSpeed: v })}>
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────────
export default function App() {
  // Scene library
  const [scenes, setScenes] = useState({ [KONBINI_01.scene_id]: KONBINI_01 });
  const [selectedSceneId, setSelectedSceneId] = useState(null);

  // Game state
  const [phase, setPhase] = useState("title"); // title | playing | ending | review
  const scene = selectedSceneId ? scenes[selectedSceneId] : null;
  const [playerName, setPlayerName] = useState("Andi");
  const [currentNodeId, setCurrentNodeId] = useState(null);
  const [history, setHistory] = useState([]);
  const [score, setScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const [flags, setFlags] = useState({});
  const [scoreToast, setScoreToast] = useState(null);
  const [saves, setSaves] = useState({});

  // UI state
  const [showBacklog, setShowBacklog] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSaveLoad, setShowSaveLoad] = useState(null); // null | "save" | "load"
  const [settings, setSettings] = useState({ furigana: true, translation: "id", showAnnotations: true, textSpeed: "normal" });
  const [nameInput, setNameInput] = useState("Andi");

  // Tier access
  const [tKey, setTKey] = useState(null);
  const [showKeyPrompt, setShowKeyPrompt] = useState(false);
  const tapCount = useRef(0);
  const tapTimer = useRef(null);

  // Tap logo 5 times to trigger prompt
  const handleLogoTap = useCallback(() => {
    tapCount.current++;
    if (tapTimer.current) clearTimeout(tapTimer.current);
    tapTimer.current = setTimeout(() => { tapCount.current = 0; }, 1500);
    if (tapCount.current >= 5) {
      tapCount.current = 0;
      setShowKeyPrompt(true);
    }
  }, []);

  // Filter scenes by tier
  const visibleScenes = useMemo(() => {
    const maxTier = tKey ? 2 : 1;
    return Object.values(scenes).filter(s => (s.tier || 1) <= maxTier);
  }, [scenes, tKey]);

  // Fetch scenes from API
  const fetchScenes = useCallback((accessKey) => {
    const headers = accessKey ? { "X-Access-Key": accessKey } : {};
    return fetch(`${API_BASE}/api/scenes`, { headers })
      .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(data => {
        const list = Array.isArray(data) ? data : data.scenes || [];
        if (list.length > 0) {
          setScenes(prev => {
            const updated = { ...prev };
            for (const s of list) if (s.scene_id) updated[s.scene_id] = s;
            return updated;
          });
        }
        return list;
      });
  }, []);

  // Fetch on mount (no key)
  useEffect(() => {
    fetchScenes(null).catch(() => { /* keep bundled KONBINI_01 as fallback */ });
  }, [fetchScenes]);

  // Try unlock: validate key against backend via status code
  const [keyError, setKeyError] = useState(null);
  const tryUnlock = useCallback((key) => {
    setKeyError(null);
    fetchScenes(key)
      .then(() => { setTKey(key); setShowKeyPrompt(false); })
      .catch(err => {
        const code = Number(err.message);
        if (code === 401 || code === 403) setKeyError("Invalid key");
        else setKeyError("Connection error");
      });
  }, [fetchScenes]);

  const dialogRef = useRef(null);

  const currentNode = useMemo(() => currentNodeId && scene?.nodes ? getNode(scene.nodes, currentNodeId) : null, [scene, currentNodeId]);

  // Typewriter speed based on settings + node pacing
  const typeSpeed = useMemo(() => {
    const base = settings.textSpeed === "slow" ? 50 : settings.textSpeed === "fast" ? 12 : 28;
    if (currentNode?.pacing?.text_speed === "slow") return Math.max(base, 45);
    if (currentNode?.pacing?.text_speed === "fast") return Math.min(base, 15);
    return base;
  }, [settings.textSpeed, currentNode]);

  const typewriterText = currentNode?.type === "dialog" ? replName(currentNode.text, playerName) : "";
  const { displayed: typedChars, isDone: typingDone, skip: skipTyping } = useTypewriter(typewriterText, typeSpeed);

  // Scene JSON upload
  const [showSceneUpload, setShowSceneUpload] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const handleSceneUpload = useCallback((jsonText) => {
    try {
      let parsed = JSON.parse(jsonText);
      const sceneList = Array.isArray(parsed) ? parsed : [parsed];

      // Validate and prepare scenes first (sync)
      const validScenes = [];
      for (const s of sceneList) {
        if (!s.nodes || !Array.isArray(s.nodes) || s.nodes.length === 0) continue;
        if (!s.scene_id) s.scene_id = "scene_" + Date.now() + "_" + validScenes.length;
        if (!s.title) s.title = s.scene_id;
        if (!s.title_id) s.title_id = s.scene_id;
        if (!s.review) s.review = { vocab_list: [], grammar_list: [], quiz: [] };
        if (!s.characters) s.characters = [];
        validScenes.push(s);
      }

      if (validScenes.length === 0) {
        setUploadError("No valid scenes found (need nodes array)");
        return;
      }

      // Now update state
      setScenes(prev => {
        const updated = { ...prev };
        for (const s of validScenes) {
          updated[s.scene_id] = s;
        }
        return updated;
      });

      setUploadError(null);
      setShowSceneUpload(false);
    } catch (e) {
      setUploadError("JSON parse error: " + e.message);
    }
  }, []);

  const handleFileUpload = useCallback((e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => handleSceneUpload(ev.target.result);
      reader.readAsText(file);
    });
  }, [handleSceneUpload]);

  // Start game with selected scene (fetch full data if needed)
  const startGame = (sceneId) => {
    const s = scenes[sceneId];
    if (!s) return;
    if (s.nodes && s.nodes.length > 0) {
      setSelectedSceneId(sceneId);
      setPlayerName(nameInput.trim() || "Andi");
      setCurrentNodeId(s.nodes[0].id);
      setHistory([]);
      setScore(0);
      setMaxScore(0);
      setFlags({});
      setPhase("playing");
    } else {
      const headers = tKey ? { "X-Access-Key": tKey } : {};
      fetch(`${API_BASE}/api/scenes/${sceneId}`, { headers })
        .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
        .then(full => {
          if (!full.nodes || full.nodes.length === 0) return;
          setScenes(prev => ({ ...prev, [sceneId]: full }));
          setSelectedSceneId(sceneId);
          setPlayerName(nameInput.trim() || "Andi");
          setCurrentNodeId(full.nodes[0].id);
          setHistory([]);
          setScore(0);
          setMaxScore(0);
          setFlags({});
          setPhase("playing");
        })
        .catch(() => {});
    }
  };

  // Advance dialog — tap while typing = skip, tap when done = next node
  const handleDialogTap = useCallback(() => {
    if (!currentNode || currentNode.type !== "dialog") return;
    if (!typingDone) {
      skipTyping();
      return;
    }
    // Advance to next
    const next = currentNode.next;
    if (!next) return;
    const nextNode = getNode(scene.nodes, next);
    if (!nextNode) return;
    setHistory(prev => [...prev, { node: currentNode }]);
    if (nextNode.type === "ending") {
      const ending = determineEnding(scene.nodes, score);
      setCurrentNodeId(ending.id);
      setPhase("ending");
      return;
    }
    setCurrentNodeId(next);
  }, [currentNode, typingDone, skipTyping, scene, score]);

  // Handle choice — navigate immediately, show non-blocking toast
  const handleChoice = useCallback((optIdx) => {
    const opt = currentNode.options[optIdx];
    // Track score
    if (opt.score) {
      setScore(prev => prev + opt.score);
    }
    // Track max possible score
    const maxOpt = Math.max(...currentNode.options.map(o => o.score || 0));
    setMaxScore(prev => prev + maxOpt);
    // Set flags
    if (opt.flags_set) {
      setFlags(prev => {
        const f = { ...prev };
        opt.flags_set.forEach(flag => { f[flag] = true; });
        return f;
      });
    }
    // Add choice to history (with full feedback accessible in backlog)
    setHistory(prev => [...prev, { node: currentNode, chosenOption: opt }]);
    // Show score toast (auto-dismiss)
    setScoreToast(opt);
    setTimeout(() => setScoreToast(null), 2500);
    // Navigate to next node immediately
    if (opt.next) {
      const nextNode = getNode(scene.nodes, opt.next);
      if (nextNode && nextNode.type === "ending") {
        const ending = determineEnding(scene.nodes, score + (opt.score || 0));
        setCurrentNodeId(ending.id);
        setPhase("ending");
      } else {
        setCurrentNodeId(opt.next);
      }
    }
  }, [currentNode, scene, score]);

  // Save at checkpoint
  const saveGame = useCallback((slot) => {
    if (!currentNode?.checkpoint && currentNode?.type !== "dialog") return;
    setSaves(prev => ({
      ...prev,
      [slot]: {
        nodeId: currentNodeId,
        score,
        maxScore,
        flags: { ...flags },
        history: [...history],
        sceneTitle: scene?.title_id || scene?.scene_id || "unknown",
        savedAt: new Date().toISOString(),
      }
    }));
    setShowSaveLoad(null);
  }, [currentNode, currentNodeId, score, maxScore, flags, history, scene]);

  // Load
  const loadGame = useCallback((slot) => {
    const s = saves[slot];
    if (!s) return;
    setCurrentNodeId(s.nodeId);
    setScore(s.score);
    setMaxScore(s.maxScore);
    setFlags({ ...s.flags });
    setHistory([...s.history]);
    setPhase("playing");
    setShowSaveLoad(null);
    setScoreToast(null);
  }, [saves]);

  // Auto-skip empty transition nodes
  useEffect(() => {
    if (currentNode && currentNode.type === "dialog" && !currentNode.text && currentNode.next) {
      const timer = setTimeout(() => handleDialogTap(), 50);
      return () => clearTimeout(timer);
    }
  }, [currentNodeId]);

  // Scroll dialog into view
  useEffect(() => {
    if (dialogRef.current) dialogRef.current.scrollTop = dialogRef.current.scrollHeight;
  }, [currentNodeId]);

  // ── TITLE SCREEN / SCENE BROWSER ──
  if (phase === "title") {
    const sceneList = visibleScenes.sort((a, b) => (a.phase || 0) - (b.phase || 0) || (a.scene_id || "").localeCompare(b.scene_id || ""));
    return (
      <div style={S.root}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "radial-gradient(ellipse at 50% 10%, #12122a 0%, #08080f 70%)" }}>
          {/* Header */}
          <div style={{ textAlign: "center", padding: "1.5rem 1rem 0.5rem" }}>
            <div style={S.titleMain} onClick={handleLogoTap}>暮らシム</div>
            <div style={S.titleSub}>Kurashimu</div>
          </div>

          {/* Player name */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.5rem 1rem" }}>
            <input
              style={{ ...S.input, width: "160px", fontSize: "0.9rem", padding: "0.4rem 0.8rem" }}
              placeholder="Nama..."
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
            />
            <span style={{ fontSize: "0.7rem", color: "#3a3a5a" }}>nama karakter</span>
          </div>

          {/* Action bar */}
          <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", padding: "0.5rem 1rem" }}>
            <button style={{ ...S.topBtn, fontSize: "0.8rem", padding: "0.4rem 0.8rem" }} onClick={() => setShowSceneUpload(true)}>
              📁 Add Scenes
            </button>
            {Object.keys(saves).length > 0 && (
              <button style={{ ...S.topBtn, fontSize: "0.8rem", padding: "0.4rem 0.8rem" }} onClick={() => setShowSaveLoad("load")}>
                💾 Load Save
              </button>
            )}
            <span style={{ fontSize: "0.7rem", color: "#3a3a5a", alignSelf: "center" }}>{sceneList.length} scenes</span>
          </div>

          {/* Scene list */}
          <div style={{ flex: 1, overflowY: "auto", padding: "0.5rem 1rem 1rem" }}>
            {sceneList.map(s => (
              <div
                key={s.scene_id}
                style={{
                  background: "rgba(15,15,30,0.6)", border: "1px solid #1a1a2e", borderRadius: "8px",
                  padding: "0.8rem 1rem", marginBottom: "0.5rem", cursor: "pointer",
                  transition: "all 0.15s",
                }}
                onClick={() => startGame(s.scene_id)}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#3a4a7a"; e.currentTarget.style.background = "rgba(20,20,40,0.8)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#1a1a2e"; e.currentTarget.style.background = "rgba(15,15,30,0.6)"; }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.95rem", color: "#b0b0d0" }}>{s.title || s.scene_id}</div>
                    <div style={{ fontSize: "0.78rem", color: "#6a6a8a", marginTop: "0.15rem" }}>{s.title_id || ""}</div>
                    {s.description && <div style={{ fontSize: "0.7rem", color: "#4a4a6a", marginTop: "0.3rem", lineHeight: 1.4 }}>{s.description}</div>}
                  </div>
                  <div style={{ display: "flex", gap: "0.3rem", marginLeft: "0.5rem", flexShrink: 0 }}>
                    {s.level && <span style={{ fontSize: "0.65rem", padding: "0.1rem 0.4rem", background: "rgba(90,122,255,0.15)", border: "1px solid #3a4a7a", borderRadius: "3px", color: "#7a9aff" }}>{s.level}</span>}
                    {s.phase && <span style={{ fontSize: "0.65rem", padding: "0.1rem 0.4rem", background: "rgba(90,122,255,0.08)", border: "1px solid #2a3a5a", borderRadius: "3px", color: "#5a7a9a" }}>P{s.phase}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scene Upload Panel */}
        {showSceneUpload && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(6,6,12,0.97)", zIndex: 100, display: "flex", flexDirection: "column" }}>
            <div style={S.blogHeader}>
              <div style={S.blogTitle}>ADD SCENES</div>
              <button style={S.topBtn} onClick={() => { setShowSceneUpload(false); setUploadError(null); }}>✕ Close</button>
            </div>
            <div style={{ flex: 1, padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              {/* File upload */}
              <div>
                <div style={{ fontSize: "0.8rem", color: "#6a6a8a", marginBottom: "0.5rem", letterSpacing: "0.1em" }}>FROM FILES</div>
                <label style={{
                  display: "block", padding: "1.5rem", border: "1px dashed #2a2a4a", borderRadius: "8px",
                  textAlign: "center", cursor: "pointer", color: "#5a5a7a", fontSize: "0.9rem",
                  transition: "border-color 0.2s",
                }}>
                  Tap to select .json files (multiple OK)
                  <input type="file" accept=".json" multiple onChange={handleFileUpload} style={{ display: "none" }} />
                </label>
              </div>
              {/* Paste JSON */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: "0.8rem", color: "#6a6a8a", marginBottom: "0.5rem", letterSpacing: "0.1em" }}>OR PASTE JSON</div>
                <textarea
                  id="scene-paste"
                  style={{
                    flex: 1, background: "rgba(10,10,20,0.8)", border: "1px solid #2a2a4a", borderRadius: "6px",
                    padding: "0.8rem", color: "#a0a0c0", fontSize: "0.8rem", fontFamily: "monospace",
                    resize: "none", outline: "none", minHeight: "150px",
                  }}
                  placeholder='Single scene or array: [{"scene_id": "..."}, ...]'
                />
                <button
                  style={{ ...S.btn, marginTop: "0.8rem", alignSelf: "center" }}
                  onClick={() => {
                    const el = document.getElementById("scene-paste");
                    if (el && el.value.trim()) handleSceneUpload(el.value);
                  }}
                >
                  Add Scenes
                </button>
              </div>
              {/* Error */}
              {uploadError && (
                <div style={{ padding: "0.6rem 0.8rem", background: "rgba(248,113,113,0.1)", border: "1px solid #f8717144", borderRadius: "6px", fontSize: "0.8rem", color: "#f87171" }}>
                  {uploadError}
                </div>
              )}
              {/* Info */}
              <div style={{ fontSize: "0.7rem", color: "#3a3a5a", textAlign: "center" }}>
                Supports single scene JSON, array of scenes, or multiple files. Duplicate scene_ids will be updated.
              </div>
            </div>
          </div>
        )}

        {showSaveLoad && (
          <SaveLoadPanel saves={saves} mode="load" onSave={() => {}} onLoad={(i) => loadGame(i)} onClose={() => setShowSaveLoad(null)} />
        )}

        {/* Access key prompt */}
        {showKeyPrompt && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(6,6,12,0.97)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ background: "rgba(15,15,30,0.95)", border: "1px solid #1e1e3a", borderRadius: "8px", padding: "1.5rem", maxWidth: "300px", textAlign: "center" }}>
              <div style={{ fontSize: "0.85rem", color: "#6a6a8a", marginBottom: "1rem" }}>Access Key</div>
              <input
                id="tk-input"
                type="password"
                style={{ ...S.input, width: "100%", marginBottom: "0.8rem" }}
                placeholder="Enter key..."
                autoFocus
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    const v = e.target.value.trim();
                    if (v) tryUnlock(v);
                  } else if (e.key === "Escape") {
                    setShowKeyPrompt(false);
                  }
                }}
              />
              {keyError && <div style={{ fontSize: "0.75rem", color: "#f87171", marginBottom: "0.5rem" }}>{keyError}</div>}
              <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                <button style={S.topBtn} onClick={() => {
                  const el = document.getElementById("tk-input");
                  const v = el?.value?.trim();
                  if (v) tryUnlock(v);
                }}>OK</button>
                <button style={S.topBtn} onClick={() => setShowKeyPrompt(false)}>Cancel</button>
                {tKey && <button style={{ ...S.topBtn, color: "#f87171" }} onClick={() => { setTKey(null); setShowKeyPrompt(false); fetchScenes(null).catch(() => {}); }}>Lock</button>}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── ENDING SCREEN ──
  if (phase === "ending" && currentNode?.type === "ending") {
    const variantColors = { good: "#4ade80", neutral: "#facc15", bad: "#f87171" };
    const variantLabels = { good: "GOOD END", neutral: "NEUTRAL END", bad: "BAD END" };
    const vc = variantColors[currentNode.variant] || "#aaa";
    return (
      <div style={S.root}>
        <div style={S.ending}>
          <div style={{ ...S.endLabel, color: vc }}>{variantLabels[currentNode.variant]}</div>
          <div style={S.endText}>{currentNode.text}</div>
          <div style={S.endScore}>Score: {score}/{maxScore}</div>
          <div style={{ display: "flex", gap: "0.8rem", marginTop: "2rem" }}>
            {scene.review && scene.review.quiz && scene.review.quiz.length > 0 && (
              <button style={S.btn} onClick={() => setPhase("review")}>復習クイズ</button>
            )}
            <button style={{ ...S.btn, background: "transparent" }} onClick={() => { setPhase("title"); setCurrentNodeId(null); setSelectedSceneId(null); }}>タイトルに戻る</button>
          </div>
        </div>
      </div>
    );
  }

  // ── REVIEW SCREEN ──
  if (phase === "review") {
    return (
      <div style={S.root}>
        <ReviewScreen review={scene.review} onFinish={() => { setPhase("title"); setCurrentNodeId(null); setSelectedSceneId(null); }} />
      </div>
    );
  }

  // ── GAME SCREEN ──
  if (!scene || !currentNode) return <div style={S.root}><div style={S.title}><div style={S.titleMain}>Loading...</div></div></div>;

  const char = currentNode.speaker ? getCharacter(scene.characters, currentNode.speaker) : null;
  const speakerDisplay = currentNode.subtype === "inner_monologue" ? "💭 Inner Thoughts"
    : currentNode.subtype === "atmosphere" ? "🌙"
    : currentNode.subtype === "narration" ? "📖"
    : char ? char.name : "";
  const speakerColor = char ? char.color
    : currentNode.subtype === "inner_monologue" ? "#a8b8d8"
    : currentNode.subtype === "atmosphere" ? "#7a8aaa"
    : "#9a9aba";

  const isChoice = currentNode.type === "choice";
  const isAtCheckpoint = currentNode.checkpoint === true;

  return (
    <div style={S.root}>
      {/* Top bar */}
      <div style={S.topBar}>
        <div style={S.topTitle}>
          {scene.title_id}
          {isAtCheckpoint && <span style={{ marginLeft: "0.5rem", color: "#4ade80", fontSize: "0.7rem" }}>● checkpoint</span>}
        </div>
        <div style={S.topBtns}>
          <button style={S.topBtn} onClick={() => setShowBacklog(true)}>LOG</button>
          <button style={S.topBtn} onClick={() => setShowSaveLoad("save")} title="Save">SAVE</button>
          <button style={S.topBtn} onClick={() => setShowSaveLoad("load")} title="Load">LOAD</button>
          <button style={S.topBtn} onClick={() => setShowSettings(true)}>⚙</button>
        </div>
      </div>

      {/* Score bar */}
      <div style={{ padding: "0.3rem 1rem", background: "#0a0a14", borderBottom: "1px solid #111125", display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "#3a3a5a" }}>
        <span>Score: {score}</span>
        <span>Flags: {Object.keys(flags).filter(k => flags[k]).length}</span>
      </div>

      {/* Main area */}
      <div style={S.game}>
        <div style={S.sceneArea} ref={dialogRef}>
          {/* Ambient hint for atmosphere nodes */}
          {currentNode.subtype === "atmosphere" && currentNode.ambient && (
            <div style={{ textAlign: "center", fontSize: "0.72rem", color: "#2a3a4a", marginBottom: "0.5rem", letterSpacing: "0.1em" }}>
              ♪ {currentNode.ambient}
            </div>
          )}

          {/* Expression hint */}
          {currentNode.expression && char && (
            <div style={{ textAlign: "right", fontSize: "0.72rem", color: "#4a5a6a", marginBottom: "0.3rem", marginRight: "0.5rem" }}>
              [{currentNode.expression}]
            </div>
          )}
        </div>

        {/* Dialog or Choice */}
        {isChoice ? (
          <ChoicePanel node={currentNode} settings={settings} playerName={playerName} onChoice={handleChoice} />
        ) : (
          <div style={{ ...S.dialogBox, animation: "fadeIn 0.25s ease" }} onClick={handleDialogTap}>
            {speakerDisplay && (
              <div style={{ ...S.speaker, color: speakerColor }}>{speakerDisplay}</div>
            )}
            <TextWithAnnotations node={currentNode} settings={settings} playerName={playerName} typedChars={typedChars} typingDone={typingDone} />
            <div style={S.clickHint}>{typingDone ? "tap to continue ▸" : "tap to skip"}</div>
          </div>
        )}
      </div>

      {/* Score toast (non-blocking) */}
      {scoreToast && <ScoreToast option={scoreToast} visible={true} />}

      {/* Panels */}
      {showBacklog && <BacklogPanel history={history} characters={scene.characters} settings={settings} playerName={playerName} onClose={() => setShowBacklog(false)} />}
      {showSettings && <SettingsDrawer settings={settings} onUpdate={setSettings} onClose={() => setShowSettings(false)} />}
      {showSaveLoad && <SaveLoadPanel saves={saves} mode={showSaveLoad} onSave={saveGame} onLoad={loadGame} onClose={() => setShowSaveLoad(null)} />}
    </div>
  );
}
