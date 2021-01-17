const Account = require("../models/account");
const axios = require("axios");

const facebookApiUrl = process.env.FACEBOOK_GRAPH_API_URL;

let tokenAuthenticateTimeOut;

const isFbAuthenticate = async (access_token, expires_in) => {
    let check = false;

    await axios.get(`${facebookApiUrl}/me?access_token=${access_token}`)
        .then(async (response) => {
            console.log(response.data);

            let fbAccount = response.data;
            let account = await Account.findOne({ type: "facebook", user_id: fbAccount.id }).exec();
            if(!account) {
                account = new Account({
                    name: fbAccount.name,
                    user_id: fbAccount.id,
                    type: "facebook",
                    created_at: Date.now()
                });
            }

            account.access_token = access_token;
            await account.save();
            //startCheckExpiredAccessToken(access_token, expires_in);
            check = true;
        })
        .catch(async (error) => {
            console.log(error);
        });

    return check;
}

// const startCheckExpiredAccessToken = async (token, time) => {
//     clearTimeout(tokenAuthenticateTimeOut);

//     let account = await Account.findOne({ access_token: token }).exec();
//     if(!account) {
//         return;
//     }

//     tokenAuthenticateTimeOut = setTimeout(() => isFbAuthenticate(token), time);
// }

module.exports = { isFbAuthenticate }