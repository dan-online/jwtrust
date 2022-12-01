use neon::prelude::*;

use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
struct Claims {
    exp: f64,
    iat: f64,
    payload: String,
    // tbh these aren't really used, hOwever, I'll leave them here if someone wants to open an issue/pr
    // aud: String, // Optional. Audience
    // iss: String, // Optional. Issuer
    // nbf: usize,  // Optional. Not Before (as UTC timestamp)
    // sub: String, // Optional. Subject (whom token refers to)
}

impl Claims {
    fn to_object<'a>(&self, cx: &mut FunctionContext<'a>) -> JsResult<'a, JsObject> {
        let obj = cx.empty_object();

        let exp = cx.number(*&self.exp as f64);
        obj.set(cx, "exp", exp)?;

        let iat = cx.number::<f64>(*&self.iat as f64);
        obj.set(cx, "iat", iat)?;

        let payload = cx.string(&self.payload);
        obj.set(cx, "payload", payload)?;

        Ok(obj)
    }
}

fn sign(mut cx: FunctionContext) -> JsResult<JsString> {
    let secret: String = cx
        .argument::<JsString>(0)?
        .downcast::<JsString, FunctionContext>(&mut cx)
        .unwrap()
        .value(&mut cx);

    let payload: String = cx
        .argument::<JsString>(1)?
        .downcast::<JsString, FunctionContext>(&mut cx)
        .unwrap()
        .value(&mut cx);

    let claims_input: Handle<JsObject> = cx.argument(2)?;
    let exp: f64 = claims_input
        .get::<JsNumber, FunctionContext, &str>(&mut cx, "exp")?
        .downcast::<JsNumber, FunctionContext>(&mut cx)
        .unwrap()
        .value(&mut cx);

    let iat: f64 = claims_input
        .get::<JsNumber, FunctionContext, &str>(&mut cx, "iat")?
        .downcast::<JsNumber, FunctionContext>(&mut cx)
        .unwrap()
        .value(&mut cx);

    let claims: Claims = Claims { exp, iat, payload };

    let token_result = encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(secret.as_ref()),
    );
    let token = match token_result {
        Ok(token) => token,
        Err(err) => {
            return cx.throw_error(err.to_string());
        }
    };

    Ok(cx.string(token))
}

fn verify(mut cx: FunctionContext) -> JsResult<JsObject> {
    let secret: String = cx
        .argument::<JsString>(0)?
        .downcast::<JsString, FunctionContext>(&mut cx)
        .unwrap()
        .value(&mut cx);

    let token: String = cx
        .argument::<JsString>(1)?
        .downcast::<JsString, FunctionContext>(&mut cx)
        .unwrap()
        .value(&mut cx);

    let decoded = decode::<Claims>(
        &token,
        &DecodingKey::from_secret(secret.as_ref()),
        &Validation::default(),
    );

    let decoded_claim = match decoded {
        Ok(decoded) => decoded.claims,
        Err(err) => {
            return cx.throw_error(err.to_string());
        }
    };

    Ok(decoded_claim.to_object(&mut cx)?)
}

#[neon::main]
fn main(mut cx: ModuleContext) -> NeonResult<()> {
    cx.export_function("sign", sign)?;
    cx.export_function("verify", verify)?;
    Ok(())
}
