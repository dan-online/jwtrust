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
pub struct VerifyResult {
  claims: Claims,
  payload: String,
}

#[wasm_bindgen]
pub struct SignResult {
  token: String,
}

#[wasm_bindgen]
impl SignResult {
  pub fn get_token(&self) -> String {
    return self.token.to_string();
  }
}

#[wasm_bindgen]
impl VerifyResult {
  pub fn get_exp(&self) -> f64 {
    return self.claims.exp;
  }

  pub fn get_iat(&self) -> f64 {
    return self.claims.iat;
  }

  pub fn get_payload(&self) -> String {
    return self.payload.to_string();
  }
}

#[wasm_bindgen]
pub fn sign(secret: String, payload: String, exp: f64, iat: f64) -> String {
  let key: Hmac<Sha256> = Hmac::new_from_slice(secret.as_bytes()).unwrap();
  let mut claims = BTreeMap::new();
  let header = Header {
    algorithm: AlgorithmType::Hs256,
    ..Default::default()
  };

  claims.insert("exp", exp.to_string());
  claims.insert("iat", iat.to_string());
  claims.insert("payload", payload);

  let token_result = Token::new(header, claims).sign_with_key(&key);

  let token = match token_result {
    Ok(token) => token.into(),
    Err(err) => {
      throw_str(err.to_string().as_str());
    }
  };

  return token;
}

#[wasm_bindgen]
pub fn verify(secret: String, token_str: String) -> VerifyResult {
  let key: Hmac<Sha256> = Hmac::new_from_slice(secret.as_bytes()).unwrap();

  let token_result = VerifyWithKey::verify_with_key(token_str.as_ref(), &key);

  let token: Token<Header, BTreeMap<String, String>, _> = match token_result {
    Ok(token) => token,
    Err(err) => {
      throw_str(err.to_string().as_str());
    }
  };
  // let header = token.header();
  let decoded_claims = token.claims();

  let exp = decoded_claims.get("exp").unwrap().parse::<f64>().unwrap();
  let iat = decoded_claims.get("iat").unwrap().parse::<f64>().unwrap();
  let payload = decoded_claims.get("payload").unwrap().to_string();

  let decoded = VerifyResult {
    claims: Claims { exp, iat },
    payload,
  };

  return decoded;
}
