/**
 * Created by iyobo on 2017-04-18.
 */


export const deriveEntityName = (data) => {
    return data.get ? (data.get('name') || data.get('title') || data.get('id') || '' ) : '';
}