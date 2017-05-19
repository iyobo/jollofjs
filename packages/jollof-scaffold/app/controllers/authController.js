exports.doLogin = async (ctx) => {
    ctx.body = JSON.stringify(ctx.request.fields);

}

exports.doSignup = async (ctx) => {
    ctx.body = JSON.stringify(ctx.request.fields);
}