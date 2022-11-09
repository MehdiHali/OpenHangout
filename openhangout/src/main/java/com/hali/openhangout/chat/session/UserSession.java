package com.hali.openhangout.chat.session;

import com.hali.openhangout.chat.room.Room;

public class UserSession {
	private String id;
	private Room room;
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public Room getRoom() {
		return room;
	}
	public void setRoom(Room room) {
		this.room = room;
	}

}
