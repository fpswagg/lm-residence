const fs = require("fs");
const path = require("path");
const https = require("https");
const url = require("url");

const images = [
    "https://scontent.fdla3-2.fna.fbcdn.net/v/t39.30808-6/473792755_1127576452202966_9038392515624919228_n.jpg?stp=dst-jpg_s851x315_tt6&_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeGWMVQazZLggJwSl8R11f3qiwOO-gm6uTmLA476Cbq5OcDuqbv_sm3nH-mRAtHx3_R-lDt89y8x6_wPbTYsmTXI&_nc_ohc=TM0iiHIReIYQ7kNvwEOxstO&_nc_oc=AdnYUi3xDwiAYGboK-BKBC1XUIYD0F6TPqTtJX_8PGann6D_YWHMjqUv5jfvA9QRwEM&_nc_zt=23&_nc_ht=scontent.fdla3-2.fna&_nc_gid=cfffr0dCLTN-fVVsEulK6A&oh=00_AfhmBPZwqMeMdhYi1Lf8qimD_AapKHJ5jM76Yg1snLmfww&oe=6918CE75",
    "https://scontent.fdla3-2.fna.fbcdn.net/v/t39.30808-6/473998348_1128023262158285_493386290714142724_n.jpg?stp=dst-jpg_s720x720_tt6&_nc_cat=100&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeEHGY0eFNeHrNZC2AF_mSNVHjbb_npATrEeNtv-ekBOsf_8LXDOs-_7p09kzum50zED5CMIfQXB3je4YnVgHxEO&_nc_ohc=eHlSnO9R6PUQ7kNvwGJGR0G&_nc_oc=AdmyJ5UAS7sAJAn9M1iasxMxCP9sX3W2sKLuDxhCiVdWpZ40yqIKUku608sPqSr7Bj4&_nc_zt=23&_nc_ht=scontent.fdla3-2.fna&_nc_gid=AdKpweGn2JToIEYD4eA1FA&oh=00_Afg_1B5srMQpamJGru-dcf58KVYPmj5A9IhoGepRGuazcA&oe=6918C1A7",
    "https://scontent.fkbi1-1.fna.fbcdn.net/v/t39.30808-6/473700781_1128021228825155_8541484128939731387_n.jpg?stp=dst-jpg_p180x540_tt6&_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeE_wlCF8VzcQ1P3vFhJDD0LKrgqrbWXt2squCqttZe3a3h5BNrIvo1n5upYC-Nubbp2vkuHxH_5H52qLSSSG5QS&_nc_ohc=SDCkzwPe5wEQ7kNvwGOZaiN&_nc_oc=AdmINpQsU2ouz5NGTi89r1ESbPAv93o0_KV6bOWlxcwSqsrEGtLvQGvUcKbNbgypn74&_nc_zt=23&_nc_ht=scontent.fkbi1-1.fna&_nc_gid=bWELED28Q6OkT0E6yfOX-A&oh=00_Afg_WsICLZXSa-4QHVVk5l7QykxIKGzlF2h8D7ygYVkfWA&oe=6918B9A8",
    "https://scontent.fkbi1-1.fna.fbcdn.net/v/t39.30808-6/473991206_1128020298825248_6454834365706770679_n.jpg?stp=dst-jpg_p180x540_tt6&_nc_cat=110&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeGosDgrBea8XA3SaI0KAobxkC8YwBQu7yKQLxjAFC7vItVYQJ4R44LcdcicmHJj4olCorVhmaADClqaiy9c2__O&_nc_ohc=Jd1HqAHiD58Q7kNvwHC6v4Y&_nc_oc=AdnDT66ILL0E2V3WLncpv3R-wyrx-zSA0bWRJZmVQhTlw59WY9o6Xmwm882ngB-6c_0&_nc_zt=23&_nc_ht=scontent.fkbi1-1.fna&_nc_gid=bWELED28Q6OkT0E6yfOX-A&oh=00_AfiNz54qo1bITFpvcYqcpptLL4dANW8FnoVyGDBl3vjrKA&oe=6918DF05",
    "https://scontent.fkbi1-1.fna.fbcdn.net/v/t39.30808-6/474036436_1128019718825306_2994601646965669949_n.jpg?stp=dst-jpg_s720x720_tt6&_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeEKusO86rDOickpQluCVrV89HbcFY-VUyL0dtwVj5VTIuoXG0lQEZJbIrRpFJ12RvYhUPMwAYDlerNH4atTaoCm&_nc_ohc=Jcq0pq5_8lMQ7kNvwGZBtSH&_nc_oc=Adkh6-bpSszvdBc2OCmAbzUOl0BHuVs2piRJ6eWU2WQ2O39aYgNRrjmJWbuyyEp93bc&_nc_zt=23&_nc_ht=scontent.fkbi1-1.fna&_nc_gid=bWELED28Q6OkT0E6yfOX-A&oh=00_AfhcsfJexVPTIPGgzeDCLwuhhN4nEDTSb-x8vKux3VWBiA&oe=6918D71D",
    "https://scontent.fkbi1-1.fna.fbcdn.net/v/t39.30808-6/474449175_1128018922158719_2780678310637126099_n.jpg?stp=dst-jpg_p180x540_tt6&_nc_cat=105&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeGhK-1SwJRXrFijvmZjIt_HHtGYCv_6Kxoe0ZgK__orGjx0_5TLAsi87PcQt_ZKhPTVzav6C-b8bcgEjTEXWHdB&_nc_ohc=YbHdmjzcdYEQ7kNvwEGWcjD&_nc_oc=AdkmruouAqUw81F2JRKFS5sigtyo06sSY5sX8EsNkNJwMx89MZYUvSpKLcXraKORYSs&_nc_zt=23&_nc_ht=scontent.fkbi1-1.fna&_nc_gid=J9RLMmeDD9MNpIOan6GGzQ&oh=00_Afi5O7oawpimOilxCyH6pWSJ_kGnnQRqTE_AdLOOVSd25Q&oe=6918E431",
    "https://scontent.fkbi1-1.fna.fbcdn.net/v/t39.30808-6/474461732_1128018928825385_6734597260998679948_n.jpg?stp=dst-jpg_p526x296_tt6&_nc_cat=101&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeFsG6tIA5iPcXhzhs4L7iUa4DAUDLK25hngMBQMsrbmGX50_fl5xCXn6SZmT0m-QEa6OGLsRgRB7DmokBd87gFv&_nc_ohc=agdjuQ0ajyMQ7kNvwFDHinu&_nc_oc=Adljw1q2RXkjZ_Pk3kT5SKY9Lfz-q0YPe-ASF48Cl5XZXfvWRJxhOXBCkFQqFpVKJZ0&_nc_zt=23&_nc_ht=scontent.fkbi1-1.fna&_nc_gid=J9RLMmeDD9MNpIOan6GGzQ&oh=00_AfiT5Gm7SgNrqBcB12I0Tswi7CK3In9ZU5Cxzt4Sn-Cy4A&oe=6918BD6E",
    "https://scontent.fkbi1-1.fna.fbcdn.net/v/t39.30808-6/473991206_1128016158825662_7400241006303695190_n.jpg?stp=dst-jpg_s640x640_tt6&_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeHc9Z7ziqFUwry4x1zzMpZSlQbtu3W8S-eVBu27dbxL56LEfIdajwL0ozS40-VCZWFnA9ikFuOV-ygueilYmUIt&_nc_ohc=ULrij4v-Ez8Q7kNvwEUjCan&_nc_oc=AdntrweHJWOXEdpR9L8uvUdRyDHwTpeqw0KcPIk1VkaFe8neapl2uCSrFY8nGQO7fYw&_nc_zt=23&_nc_ht=scontent.fkbi1-1.fna&_nc_gid=J9RLMmeDD9MNpIOan6GGzQ&oh=00_AfiyLgnMhKV_W1X-fTgD3UbrEKp0SPsfBgHRu2wMDQOZbw&oe=6918CA0E",
    "https://scontent.fkbi1-1.fna.fbcdn.net/v/t39.30808-6/473720638_1128014955492449_6572896942982918492_n.jpg?stp=dst-jpg_s640x640_tt6&_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeHE-8HchPc9vGVFGmg7SCcZwmbW7ADt1q3CZtbsAO3WrWGgGq7MHXyOgOweff8GvH9o4Hel3m11gwq973B5BSUe&_nc_ohc=1lBnN4fA83cQ7kNvwGoMYdu&_nc_oc=AdncgEr4P2OXsU9S4J5XKO5hGaFKdn_QFQc6XEw6sRgpSEgXXjFnEdtIl7sQO44Koog&_nc_zt=23&_nc_ht=scontent.fkbi1-1.fna&_nc_gid=x8oTVIUnZMZiDiI6m9Tm1g&oh=00_AfgH28QZAK2a4gOZDlV2gH_8eE0u-H64h4wg3DTapNu_Jg&oe=6918DD99",
    "https://scontent.fkbi1-1.fna.fbcdn.net/v/t39.30808-6/474035539_1127605505533394_6620424287524079719_n.jpg?stp=dst-jpg_s590x590_tt6&_nc_cat=110&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeH0JxEvtA3fDDVAWshoyv-mvqqom3n-fDC-qqibef58MOdmUOps0ToJl3Nf_zWnF4mPw-w1IbsKPYxuUezpUYQ1&_nc_ohc=vySbq6d3tA0Q7kNvwFO8w9x&_nc_oc=AdlvpPr_pwnuFqzal_mrOuB-acPtM3OXKSMlhPVyiwGe3J9XkvNxNDVZg4dNWGmf9v8&_nc_zt=23&_nc_ht=scontent.fkbi1-1.fna&_nc_gid=x8oTVIUnZMZiDiI6m9Tm1g&oh=00_AficZlH7LLA9x0Y4UHDlB0IJ4_BlhjdXTTH-jWDYlslTmg&oe=6918E36A",
    "https://scontent.fkbi1-1.fna.fbcdn.net/v/t39.30808-6/473795838_1127603655533579_5700657824847022578_n.jpg?stp=dst-jpg_p526x296_tt6&_nc_cat=110&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeG_01Eg92-5eVrpN26zZEPVlWPmPnEKbQ2VY-Y-cQptDSN0cF1KWZLG2OGjEKxgYrF3eF1XWXYf1oSDfPvTuZFg&_nc_ohc=ej0PP4Z8yz4Q7kNvwE3WftS&_nc_oc=AdnBQLCQr3dc-WuKR6F3rCmpPqzqpwHvpgIV9Skvpbi-yYuT0-NfgyTd6UDCGsXU-yA&_nc_zt=23&_nc_ht=scontent.fkbi1-1.fna&_nc_gid=x8oTVIUnZMZiDiI6m9Tm1g&oh=00_AfjFF3gSq62mdkGaWIyG9Uw_SPpTN9GSd152v3ACW44VgA&oe=6918E4C9",
    "https://scontent.fkbi1-1.fna.fbcdn.net/v/t39.30808-6/473781382_1127603065533638_2825119316020741258_n.jpg?stp=dst-jpg_s720x720_tt6&_nc_cat=110&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeE1u94H7SvCfoSryXMz8a6NqNEUNwjQPV6o0RQ3CNA9Xp50IH2-Tj7JSwD08ScQ1p_KZyQuQ2yNr3DeOTvDY8LB&_nc_ohc=1nXc8VsHnfAQ7kNvwFg0NKl&_nc_oc=Adm1vIsHY-cNPbKGHJsRgtDqwA1yOyidVsRhtubGEHVbZk0ArOzJvhGvff5KCqHtVXk&_nc_zt=23&_nc_ht=scontent.fkbi1-1.fna&_nc_gid=46i6pX_AjojbfM-xDSJXnA&oh=00_Afg1UPdcSg9Px5tKhpvz5B7AOp8RWkA1FqheapK7Icol0Q&oe=6918DCBE",
    "https://scontent.fkbi1-1.fna.fbcdn.net/v/t39.30808-6/271834029_456457515981533_7871172832404764399_n.png?stp=dst-png_s720x720&_nc_cat=105&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeEzHnajhs3T4t8faSlXk2vOVQgKevDLO_lVCAp68Ms7-YU6aFDFfB5KQ81E6S7_a-MS2xzhdvaYTaUgpsv73-Bo&_nc_ohc=M4zvJsCACPYQ7kNvwHm3cFF&_nc_oc=AdlpZbWIO--nK6rUWsZ7ERcz1sSQOA0TL_ElqKRcDS_yP0ptqZNQ6QN4g8_dyyhJCls&_nc_zt=23&_nc_ht=scontent.fkbi1-1.fna&_nc_gid=GU5qbbOuKajLBtTPvR6mRA&oh=00_AfjQT6dkQW5hQyMWUY2gRxI2phifzWTWHNUNNeBGkEkDsQ&oe=6918B6C2",
    "https://scontent.fkbi1-1.fna.fbcdn.net/v/t39.30808-6/474065840_1127598712200740_2842291789524825430_n.jpg?stp=dst-jpg_p526x296_tt6&_nc_cat=105&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeGC5sqP5E3Uwh2n4-Ms4j1K3hF6KrsUWvXeEXoquxRa9TP5KtkA83bze_AY38DCYXmfcgSlt_gqdmGnIXtITnFw&_nc_ohc=6mFtrbHOsxoQ7kNvwFGDqW8&_nc_oc=AdkA8zOHymwiAIxqnNWwfZLhjqk3o_NgdWbkloL5NiYa7SyzFE4CV1mJpbKyAEzQHKw&_nc_zt=23&_nc_ht=scontent.fkbi1-1.fna&_nc_gid=GU5qbbOuKajLBtTPvR6mRA&oh=00_AfiFFwlG2Dh5ZdkOCu5tnPQ81Z2dxhFoTNjGcgnIsjvfzg&oe=6918C456",
    "https://scontent.fdla3-2.fna.fbcdn.net/v/t39.30808-6/473991077_1127594252201186_4859697844883521664_n.jpg?stp=dst-jpg_s720x720_tt6&_nc_cat=111&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeHs2FGw6N8XlzYMMfZc2uchHle_PjuhT6IeV78-O6FPorLoUuj-Pbh8LnIGQFvZViyvCtfdwkHyufytaOZzTHRN&_nc_ohc=uctT9gnp6AEQ7kNvwElnZHn&_nc_oc=AdmE8IJHd1O1Nh_2svLoScMwC_t_GmEaIo6t3Zh49zU3xIN_EpynJ708H_YEnHG6rbE&_nc_zt=23&_nc_ht=scontent.fdla3-2.fna&_nc_gid=xBgl4S9ISHqZZqjNpA-dKA&oh=00_Afg2EYSRJUsEQzYlrGCSUBWXxRhd8NA7P9a_xDzK8pcvIw&oe=6918B5DE",
    "https://scontent.fdla3-2.fna.fbcdn.net/v/t39.30808-6/473792755_1127576452202966_9038392515624919228_n.jpg?stp=dst-jpg_s720x720_tt6&_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeGWMVQazZLggJwSl8R11f3qiwOO-gm6uTmLA476Cbq5OcDuqbv_sm3nH-mRAtHx3_R-lDt89y8x6_wPbTYsmTXI&_nc_ohc=TM0iiHIReIYQ7kNvwEOxstO&_nc_oc=AdnYUi3xDwiAYGboK-BKBC1XUIYD0F6TPqTtJX_8PGann6D_YWHMjqUv5jfvA9QRwEM&_nc_zt=23&_nc_ht=scontent.fdla3-2.fna&_nc_gid=3O_oSpNtpXLKO4YYueTBfQ&oh=00_AfhLfpgrA3r4R0iJdwp2dwE04ne1JgHQBdJoKVMviWySOg&oe=6918CE75",
    "https://scontent.fdla3-2.fna.fbcdn.net/v/t39.30808-6/473789973_1127359592224652_1024149887599889187_n.jpg?stp=dst-jpg_s960x960_tt6&_nc_cat=105&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeF9Wj6FycNO3ekPKxTzABK1lKlK65huR2-UqUrrmG5Hb5kNIb7PL1cwBqpQEarD8EQDFlKEwps9uyFu8it4z9yZ&_nc_ohc=f8TjBKCSQIcQ7kNvwFhXOY1&_nc_oc=AdmVhLsAatzMa6A-4GuyvZ1kok0jL5qcS7eHlsSKzDfDTJvlmY6UEUJQCDFs9CmEQMg&_nc_zt=23&_nc_ht=scontent.fdla3-2.fna&_nc_gid=3O_oSpNtpXLKO4YYueTBfQ&oh=00_AfjEPlAmK0wN4BdECHmStgooEaC7OUD6S-9-CdWynAmUyw&oe=6918CF20",
    "https://scontent.fdla3-2.fna.fbcdn.net/v/t39.30808-6/473994986_1127343158892962_6613687984118937369_n.jpg?stp=dst-jpg_s960x960_tt6&_nc_cat=111&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeGzUdOE5X-VM_y5T4w9L_fCUCl8-j-7BdxQKXz6P7sF3Prea3mCrI0Hs-7G6wXUy2euHn190hhAHGCJFtOQkvB6&_nc_ohc=VC3nJSfYvKIQ7kNvwFnmNAi&_nc_oc=AdkRGpdO8IbYliulp3vVTiv-b09bUf0PBAd4xu6Chkr9lzB4Ol4C3V64PC7othdR8Yc&_nc_zt=23&_nc_ht=scontent.fdla3-2.fna&_nc_gid=Z391iSraQ5w4s8i-HuehiA&oh=00_AfhAxvbrdDCZ1WChwjOEDDh3to_wbtARyKwTjztnaJRoGQ&oe=6918DDCB",
    "https://scontent.fdla3-2.fna.fbcdn.net/v/t39.30808-6/473993737_1127339102226701_933088897419631018_n.jpg?stp=dst-jpg_p526x296_tt6&_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeGYJ_NAas5ecqr5txHqpQW5HfWD9UOdG4sd9YP1Q50bi1Nc7bglWM-tGqAGLxceS--VsoNg8MtIG-LXFkkIiXd9&_nc_ohc=vnklc9VUGZcQ7kNvwHudfCG&_nc_oc=AdklElq1M2nTHxGb8zucm9Gwk4JVqebPOgZbirD-rcgAqWtJDWN6-ZMfOhN7_pBz3Q4&_nc_zt=23&_nc_ht=scontent.fdla3-2.fna&_nc_gid=w7ttrBZPqPNpnrSMjY2XdQ&oh=00_AfjSSHRFiGggM1R-91ZvKR1EKNBM6F56mzDz_P76p4dxcQ&oe=6918E31A",
    "https://scontent.fdla3-2.fna.fbcdn.net/v/t1.6435-9/135929421_222052462755374_2591069101472881984_n.jpg?stp=dst-jpg_p526x296_tt6&_nc_cat=102&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeHXaYVw2Hz2rIYpjsjgvhHvmSzZlNCHzRyZLNmU0IfNHE2D_Itfl6JIHCgzp-OI87nQoZyzmdbzilCuJJvQ1SfZ&_nc_ohc=N7LGBd_jmvkQ7kNvwGtwksC&_nc_oc=Adm59c_wponN9RrzUxD7fRXlV2Q_BZkiiY2Sfse9xfHRcD9oJOUvWMuXsonukxBBo9w&_nc_zt=23&_nc_ht=scontent.fdla3-2.fna&_nc_gid=loZp2U2VRbtVVKYIZxjJwQ&oh=00_AfjGMuy31R2CE89ADd11a86BJn8ODjyRZjmPoiT9vm6lRw&oe=693A6FFD",
    "https://scontent.fdla3-2.fna.fbcdn.net/v/t1.6435-9/132112859_212974410329846_8583766535988885941_n.jpg?stp=dst-jpg_p552x414_tt6&_nc_cat=109&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeGH00pxWkxtwKUGJ_7nSDw0AD3MI1wHRtwAPcwjXAdG3HW5a80JLpYyyUn-pmxUoBybySXQuLaytzCP7xe8OxyU&_nc_ohc=a5Wvia19dCwQ7kNvwFwnckI&_nc_oc=Adk5hnQR9xzBeBnZufMXjfz19YtLFkOXwKaHWj74WFwk2orhGp6UTVmW_MD3h_JclO4&_nc_zt=23&_nc_ht=scontent.fdla3-2.fna&_nc_gid=Gfvu8I6JUNDl0nAOEW_-4g&oh=00_AfiFbFjk096HX4ak6ssrdyBST3uetxofT-s35o-ZI4ZINg&oe=693A6A29",
    "https://scontent.fdla3-2.fna.fbcdn.net/v/t1.6435-9/131748334_209506247343329_8304055144118294324_n.jpg?stp=dst-jpg_p180x540_tt6&_nc_cat=111&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeHqf5vucsA3ZktmXcwfr_O8QgYi4-cqo5RCBiLj5yqjlP5JAnElkZYaepNhbxQjsQrurpdHQk4lJ8UVPt_dBZ3B&_nc_ohc=Xl2M84ndVVYQ7kNvwHyZwEo&_nc_oc=AdksDwRInjMB3ib6G5dM_zX43jhMx4MmBPGHNz44TXfLlj9hTgWrWcW2l3hQNbjlvTI&_nc_zt=23&_nc_ht=scontent.fdla3-2.fna&_nc_gid=1qJOz6JrH0rRM8SfF260Ew&oh=00_Afjbcu_DN2H6zClDbt3iLxBl9SevwXtUJZ8D_KW6N9SBow&oe=693A79BE",
    "https://scontent.fdla3-2.fna.fbcdn.net/v/t1.6435-9/130798363_204682857825668_6201417551558726956_n.jpg?stp=dst-jpg_p180x540_tt6&_nc_cat=107&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeGxNpo3GfXfmdhRAZ2f3MSX_tVSv985Ywf-1VK_3zljByLKfcvY58shCllghw5ColizquOPVWvWyZ_f_8U9jWBv&_nc_ohc=pO1ZHdxJ1bgQ7kNvwFAAUfr&_nc_oc=Adn_bWf3anA01FNr5j4Ahq5p2aF8ZEga2IxjpU2edBR-5mxYxm9eeC9qRWogWLFW6A0&_nc_zt=23&_nc_ht=scontent.fdla3-2.fna&_nc_gid=rjxSLE4mh3ou1j3dU9XVfQ&oh=00_AfjtPQs9RrvzVuy_T6zGzxMeUPwNTZ6Gs1zehAtLo0fzJA&oe=693A4E22",
    "https://scontent.fdla3-2.fna.fbcdn.net/v/t1.6435-9/125763403_189297629364191_5952566985979085557_n.jpg?stp=dst-jpg_p552x414_tt6&_nc_cat=103&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFq11NNMfDLIxMpQSTJyKDFPpyKE4OKtiE-nIoTg4q2Ib-baerRy0Dvoe2c5h_SAS8E8V6iBbtmz-jdCOrKDvsa&_nc_ohc=UxKLIA4t81oQ7kNvwEjtOA2&_nc_oc=Admxvu_15zjexQOyjjHgGW55_iheHOWp7Jaasu43b8-uB6CSbbkCoE1lWyiFO2GBanY&_nc_zt=23&_nc_ht=scontent.fdla3-2.fna&_nc_gid=vdZ4KLER49VD2SERRiWBwg&oh=00_AfgGOGgekXPx6yKi8q30TU9aJiV9m13P9fZXeLL7K6XApw&oe=693A6715"
]

const destFolder = path.join(__dirname, "/data/images");

function ensureFolderExists(folder) {
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
        console.log(`Création du dossier: ${folder}`);
    } else {
        console.log(`Dossier déjà existant: ${folder}`);
    }
}

function getFileNameFromUrl(imageUrl, idx) {
    try {
        // Use the pathname, remove all query params. Fallback: index.jpg/png
        const parsed = url.parse(imageUrl, true);
        let name = path.basename(parsed.pathname);
        // If the extension is missing, fallback to jpg and add index
        if (!/\.(jpg|jpeg|png|webp)$/i.test(name)) {
            name = `image_${idx}.jpg`;
        }
        return name;
    } catch (err) {
        return `image_${idx}.jpg`;
    }
}

function downloadImage(imageUrl, outputPath) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(outputPath);
        https.get(imageUrl, (response) => {
            if (response.statusCode !== 200) {
                fs.unlinkSync(outputPath);
                reject(new Error(`Échec du téléchargement (${response.statusCode}) : ${imageUrl}`));
                return;
            }
            response.pipe(file);
            file.on("finish", () => {
                file.close(() => {
                    resolve();
                });
            });
            file.on("error", (err) => {
                fs.unlinkSync(outputPath);
                reject(err);
            });
        }).on('error', (err) => {
            try { fs.unlinkSync(outputPath); } catch {}
            reject(err);
        });
    });
}

async function main() {
    ensureFolderExists(destFolder);
    let errors = 0;
    let alreadyExists = 0;
    let downloaded = 0;

    for (let i = 0; i < images.length; i++) {
        const imageUrl = images[i];
        const filename = getFileNameFromUrl(imageUrl, i);
        const filePath = path.join(destFolder, filename);

        if (fs.existsSync(filePath)) {
            alreadyExists++;
            console.log(`[${i + 1}/${images.length}] Fichier déjà téléchargé : ${filename}`);
            continue;
        }

        console.log(`[${i + 1}/${images.length}] Téléchargement : ${imageUrl}`);
        try {
            await downloadImage(imageUrl, filePath);
            console.log(`-> Téléchargé avec succès : ${filename}`);
            downloaded++;
        } catch (err) {
            errors++;
            console.error(`Erreur lors du téléchargement de ${imageUrl} : ${err.message}`);
        }
    }

    console.log(`\n=== Résumé ===`);
    console.log(`Images déjà présentes : ${alreadyExists}`);
    console.log(`Images téléchargées : ${downloaded}`);
    console.log(`Erreurs : ${errors}`);
}

main().catch(err => {
    console.error("Erreur fatale:", err);
    process.exit(1);
});