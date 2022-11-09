package com.hali. openhangout.filter;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import com.hali.util.DaoHelper;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;

//@WebFilter("/chat/*")
public class ChatFilter  {
//public class ChatFilter implements Filter {

//	@Override
//	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
//			throws IOException, ServletException {
//		// TODO Auto-generated method stub
//        HttpServletRequest req = (HttpServletRequest) request;	
//        String protocol = req.getProtocol();
//        String token = req.getHeader("privateKey");
//        try {
//        	validateToken(token);
//        }catch(Exception e) {
//			System.out.println("EXCEPTION THROWN"+e.getClass());
//				System.out.println(e.getMessage());
//				if(e instanceof SQLException) 
//				throw new WebApplicationException(getUnauthorizedResponse("INTERNAL SERVER ERROR"));
//				throw new WebApplicationException(getUnauthorizedResponse("UNAUTHORIZED"));
//        }
//
//        System.out.println("PROTOCOLE "+protocol);		
//        
//        chain.doFilter(request, response);
//	}
//	
//		
//	private void validateToken(String token) throws Exception {
//		Connection conn = DaoHelper.getDbConn();
//			PreparedStatement st = conn.prepareStatement("select * from auth_tokens where token = ?");
//			st.setString(1, token);
//			ResultSet res = st.executeQuery();
//			if(!res.next()) throw new Exception("INVALID TOKEN");
//			else {
//				boolean isExpired = res.getBoolean(5);
//				if(isExpired) throw new Exception("TOKEN EXPIRED");
//			}
//	}
//	private Response getUnauthorizedResponse(String msg) {
//		return Response.status(401, msg).build();
//	}
}
