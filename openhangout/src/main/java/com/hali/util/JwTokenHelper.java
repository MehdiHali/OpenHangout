package com.hali.util;

import java.security.SecureRandom;
import java.util.Base64;

import javax.crypto.SecretKey;

import io.jsonwebtoken.ClaimJwtException;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

/**
 * a singleton class that creates one secret_key at each runtime.
 * @author mehdi
 *
 */
public class JwTokenHelper {

	private static JwTokenHelper instance = null;
	private static SecretKey SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);
	
	// this method is used to persist a secret key throughout runtime
	public static JwTokenHelper getInstance() {
		if(instance == null) {
			System.out.println("Instantiating JwTokenHelper");
			instance = new JwTokenHelper(); 
			System.out.println("Instantiated JwTokenHelper");

		}
		return instance;
	}
		
	public String issuePK(String username, String password) {
		System.out.println("issueing PK");
		  final SecureRandom secureRandom = new SecureRandom(); //threadsafe
		  final Base64.Encoder base64Encoder = Base64.getUrlEncoder(); //threadsafe

		    byte[] randomBytes = new byte[24];
		    secureRandom.nextBytes(randomBytes);
		    String PK = base64Encoder.encodeToString(randomBytes);
			System.out.println("PK : "+PK);
		    return PK;
		    }
	
	public static void claimKey(String jwsString) throws  ExpiredJwtException, ClaimJwtException {
		Jwts
		 .parserBuilder()
		 .setSigningKey(SECRET_KEY)
		 .build()
		 // jws : Json Web Signatue
		 .parseClaimsJws(jwsString);
	}
	
	
	
	

}
