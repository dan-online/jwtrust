use hmac::{Hmac, Mac};
use jwt::{AlgorithmType, Header, SignWithKey, Token, VerifyWithKey};
use sha2::Sha256;
use std::collections::BTreeMap;
use wasm_bindgen::{prelude::*, throw_str};

#[wasm_bindgen]
pub struct Claims {
  exp: f64,
  iat: f64,
}

#[wasm_bindgen]
pub struct Decoded {
  claims: Claims,
  payload: String,
}

#[wasm_bindgen]
impl Claims {
  #[wasm_bindgen(constructor)]
  pub fn new(exp: f64, iat: f64) -> Claims {
    Claims { exp, iat }
  }
}

#[wasm_bindgen]
impl Decoded {
  pub fn get_exp(&self) -> f64 {
    return self.claims.exp;
  }

  pub fn get_payload(&self) -> String {
    return self.payload.to_string();
  }
}

#[wasm_bindgen]
pub fn sign(secret: String, payload: String, input_claims: Claims) -> String {
  let key: Hmac<Sha256> = Hmac::new_from_slice(secret.as_bytes()).unwrap();
  let header = Header {
    algorithm: AlgorithmType::Hs256,
    ..Default::default()
  };
  let mut claims = BTreeMap::new();
  claims.insert("exp", input_claims.exp.to_string());
  claims.insert("iat", input_claims.iat.to_string());
  claims.insert("payload", payload);

  let token_result = Token::new(header, claims).sign_with_key(&key);

  let token = match token_result {
    Ok(token) => token.as_str().to_string(),
    Err(err) => {
      throw_str(err.to_string().as_str());
    }
  };

  return token;
}

#[wasm_bindgen]
pub fn verify(secret: String, token_str: String) -> Decoded {
  let key: Hmac<Sha256> = Hmac::new_from_slice(secret.as_bytes()).unwrap();

  let token: Token<Header, BTreeMap<String, String>, _> =
    VerifyWithKey::verify_with_key(token_str.as_ref(), &key).unwrap();
  // let header = token.header();
  let decoded_claims = token.claims();

  let exp = decoded_claims.get("exp").unwrap().parse::<f64>().unwrap();
  let iat = decoded_claims.get("iat").unwrap().parse::<f64>().unwrap();
  let payload = decoded_claims.get("payload").unwrap().to_string();
  let claims = Claims { exp, iat };

  let decoded = Decoded { claims, payload };

  return decoded;
}
