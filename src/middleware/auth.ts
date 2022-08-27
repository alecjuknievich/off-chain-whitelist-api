import admin_token from "../../allow-list-admin.json"
import _ from 'lodash';

export const checkAdmin = (req, res, next) => {

    if (_.get(req, 'headers.authorization')){
        const token =_.get(req, 'headers.authorization');

        if (token != admin_token['token']) {
            return res
                .status(401)
                .send({error: 'not working..'})
        } else {
            return next();
        }
    } else {
        return res
            .status(401)
            .send({error: 'not working..'})
    }

}
