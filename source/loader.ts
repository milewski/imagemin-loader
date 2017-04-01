import { getOptions } from "loader-utils";
import * as imagemin from "imagemin";
import * as Validator from "ajv";

const schema = require('../schema/options.json');
const validator = new Validator({ allErrors: true });

export const raw = true;
export default function (content) {

    let { enabled = true, plugins = [] } = getOptions(this) || {};

    /**
     * Validate options
     */
    if (!validator.validate(schema, { enabled, plugins })) {
        throw validator.errorsText(null, { dataVar: 'options' })
    }

    /**
     * If there is no options, then there is nothing to do here
     */
    if (enabled === false || !plugins.length) {
        return content
    }

    plugins = plugins.map(({ use, options }) => {

        /**
         * If it's not enabled
         */
        if (options && options.enabled === false) {
            return false;
        }

        if (options)
            delete options.enabled;

        if (typeof use === 'string') {

            /**
             * Check if Plugin has been installed otherwise abort
             */
            try {
                return require(use)(options)
            } catch (e) {
                throw `You probably forgot to run "npm install ${use} --save"`
            }

        }

        return use(options)

    }).filter(Boolean)

    const callback = this.async();

    imagemin
        .buffer(content, { plugins })
        .then(buffer => callback(null, buffer))
        .catch(err => callback(err));

};
