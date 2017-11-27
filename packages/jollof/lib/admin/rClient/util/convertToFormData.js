/**
 * Created by iyobo on 2017-04-25.
 */
function appendRecursively(formData, collection, parentkey, parentIsArray) {
    //console.log(...arguments)

    for (let k in collection) {
        const val = collection[k];

        if (val === undefined) continue;

        if (val instanceof File) {
            let mkey = (parentkey ? parentkey + '.' : '') + k;

            // if(parentIsArray)
            // 	mkey = parentkey
            // else
            // 	mkey = k


            val.foo = 'bar'

            formData.append(mkey, val)
        }
        else if (Array.isArray(val)) {

            let mkey = '';
            if (parentIsArray) {
                mkey = parentkey; //parentKey can/should never be empty if parentISarray
            } else {
                mkey = (parentkey ? parentkey + '.' + k : k);
            }

            appendRecursively(formData, val, mkey, true);
        }
        else if (typeof val === 'object') {
            let mkey = (parentkey ? parentkey + '.' : '') + k;
            appendRecursively(formData, val, mkey, false);
        }
        else {
            let mkey = (parentkey ? parentkey + '.' : '') + k;
            formData.append(mkey, val)
        }

    }
}




export default function convertToFormData (data) {
    var formData = new FormData();
    appendRecursively(formData, data);
    return formData;
}