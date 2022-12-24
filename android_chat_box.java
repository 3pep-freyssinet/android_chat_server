package com.example.aymen.androidchat;


import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.util.Base64;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.DefaultItemAnimator;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

//import com.github.nkzawa.emitter.Emitter;
//import com.github.nkzawa.socketio.client.IO;
//import com.github.nkzawa.socketio.client.Socket;

import io.socket.emitter.Emitter;
import io.socket.client.IO;
import io.socket.client.Socket;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

public class ChatBoxActivity extends Fragment {
    //public class ChatBoxActivity extends AppCompatActivity {
    public RecyclerView myRecylerView ;
    public List<Message> MessageList ;
    public List<ChatUser> chatUserList = new ArrayList<ChatUser>();
    public ChatBoxAdapter chatBoxAdapter;
    private ChatUserAdapter chatUserAdapter;
    public  EditText messagetxt;
    public  Button send ;

    //declare socket object
    private Socket socket;

    private String Nickname, Id;     //my values
    private JSONObject Profile;     //my image profile
    public String toNicknameid;

    private TextView tv1, tv2, tv3;
    private ImageView imageProfile;
    //private ArrayList<String> connectedUsers = new ArrayList<String>();
    private HashMap<String, String> connectedUsers = new HashMap<String, String>();

    //private JSONObject people;
    //private String imageProfile;



    //@Override
    //protected void onCreate(Bundle savedInstanceState) {
    //    super.onCreate(savedInstanceState);
    //    setContentView(R.layout.activity_chat_box);

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
            Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.activity_chat_box, container, false);

        //connected users
        imageProfile    = (ImageView) view.findViewById(R.id.imageView);
        tv1             = (TextView) view.findViewById(R.id.tv1);
        tv2             = (TextView) view.findViewById(R.id.tv2);
        tv3             = (TextView) view.findViewById(R.id.tv3);
        myRecylerView   = (RecyclerView) view.findViewById(R.id.user_list);

        messagetxt      = (EditText) view.findViewById(R.id.message);
        send            = (Button) view.findViewById(R.id.send);

        // get the nickame of the user
        //Nickname= (String)getIntent().getExtras().getString(MainActivity.NICKNAME);

        Bundle bundle = getArguments();
        Nickname = "nickname";
        if(bundle != null){
            Nickname = bundle.getString("nickname");
            ArrayList<ChatUser> chatUserList   = (ArrayList<ChatUser>) bundle.getSerializable("chat_user_list");
        }

        return view;
    }

    @Override
    public void onStart() {
        super.onStart();

        //connect your socket client to the server
        //public static final String URL = "http://10.0.2.2:8080";      //Emulator
        //public static final String URL = "http://localhost:8080";       //Device
        //public static final String URL = "https://dry-springs-89362.herokuapp.com/";
        //socket = IO.socket("http://10.0.2.2:3000"); //emulator
        //socket = IO.socket("http://localhost:3000");  //device

        //Default bitmap
        //Bitmap bitmap = BitmapFactory.decodeResource(getResources(), R.drawable.trump);
        //Bitmap bitmap = BitmapFactory.decodeResource(getResources(), R.drawable.ic);
        //Bitmap bitmap = BitmapFactory.decodeResource(getResources(), R.drawable.maison_20180508_153845_original);
        Bitmap bitmap = BitmapFactory.decodeResource(getResources(), R.drawable.avatar);
        imageProfile.setImageBitmap(bitmap);

        //convert bitmap to array
        byte[] imageByte = convertBitmapToByteArray(bitmap);

            /*
            //Scale the images to 200x200 pixels.
            // Calculate inSampleSize
            BitmapFactory.Options options = new BitmapFactory.Options();
            options.inJustDecodeBounds = true;    //true only to get width and height

            int bitmap_width  = 100;
            int bitmap_height = 100;
            options.inSampleSize = calculateInSampleSize(options, bitmap_width, bitmap_height);
            options.inJustDecodeBounds = false;

            // Create the bitmap from byte[] The bitmap keep its original dimensions.
            Bitmap bitmap_ = BitmapFactory.decodeByteArray(imageByte, 0, imageByte.length, options);

            // Compress and encode the bitmap to base64
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            bitmap_.compress(Bitmap.CompressFormat.PNG, 100, byteArrayOutputStream);

            byte[] byteArray = byteArrayOutputStream .toByteArray();
            */

        //Encode the bitmap to base64
        String encodedImage = Base64.encodeToString(imageByte, Base64.DEFAULT);

        //Convert the encoded image to JSONObject and send it
        Profile = new JSONObject();

        //socket.emit("image-profile",imageProfile);

        socket.connect();
        for(int i = 0; i < 2; i++){
            try {
                Profile.put(Nickname + i, encodedImage);
            } catch (JSONException e) {
                e.printStackTrace();
            }
            socket.emit("join", Nickname + i, Profile);
        }

        //setting up recyler
        MessageList = new ArrayList<>();


        RecyclerView.LayoutManager mLayoutManager = new LinearLayoutManager(getContext());
        myRecylerView.setLayoutManager(mLayoutManager);
        myRecylerView.setItemAnimator(new DefaultItemAnimator());

        // message send action
        send.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //retrieve the nickname and the message content and fire the event 'messagedetection
                if (!messagetxt.getText().toString().isEmpty()) {
                    //get the chat id of 'bis'
                    Iterator<ChatUser> iterator = chatUserList.iterator();
                    while (iterator.hasNext()) {
                        ChatUser chatUser = iterator.next();
                        if (chatUser.getNickname().equals("bis")) {
                            toNicknameid = chatUser.getId();
                            break;
                        }
                    }
                    socket.emit("messagedetection", Nickname, Id, toNicknameid, messagetxt.getText().toString());
                    messagetxt.setText(" ");
                }
            }
        });

        //implementing socket listeners when a user connect.
        socket.on("userjoinedthechat", new Emitter.Listener() {
            @Override
            public void call(final Object... args) {
                getActivity().runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        String nickname     = (String) args[0];     //sender nickname
                        String id           = (String) args[1];     //sender id
                        JSONObject profile  = (JSONObject) args[2]; //sender image profile ={nickname:image profile}

                        if (nickname.equals(Nickname)) {
                            Id = id;
                            return;
                        }

                        //System.out.println("********************* user joined. all connected = "+people+" image profile = "+imageProfile);

                        //chatUserList.clear();
                        /*
                       //Build the array list of connected users.
                        Iterator<String> keys = people.keys();
                        while(keys.hasNext()){
                            String nickname_ = (String)keys.next();
                            String id_ = null;
                            String imageProfile = null;
                            try {
                                id_          = people.getString(nickname_);
                                imageProfile = profile.getString(nickname_);
                            } catch (JSONException e) {
                                e.printStackTrace();
                            }

                            ChatUser chatUser = new ChatUser(nickname_, id_, imageProfile);
                            chatUserList.add(chatUser);

                            //System.out.println("********************************* nickname = "+nickname_+" id = "+id_+" image profile = "+imageProfile);
                        }
                         */
                        // Build the 'ChatUser' object
                        ChatUser chatUser = null;
                        try {
                            chatUser = new ChatUser(nickname, id, profile.getString(nickname));
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }

                        // Add the 'ChatUser' object to the list.
                        chatUserList.add(chatUser);

                        // add the new updated list to the adapter
                        chatUserAdapter = new ChatUserAdapter(chatUserList);

                        // notify the adapter to update the recycler view
                        chatUserAdapter.notifyDataSetChanged();

                        //set the adapter for the recycler view
                        myRecylerView.setAdapter(chatUserAdapter);

                        //Response to the sender which has 'nickname' and 'id'.
                        socket.emit("lastuserjoined", nickname, id, Nickname, Id, Profile);

                        //Get the json object
                        //JsonObject jsonObj_ = JsonParser.parseString(json0).getAsJsonObject();
                        //Get the keys.
                        //Iterator<String> objectKeys = people.keys();
                        //System.out.println("********************************* objectKeys = "+objectKeys);
                        //org.json.JSONObject cannot be cast to java.lang.String[]

                        //add the connected user to map
                        //connectedUsers.put(nickname, id);
                        //String nickname = "";
                        switch (nickname) {
                            case "mono":
                                tv1.setText(nickname);
                                break;

                            case "bis":
                                tv2.setText(nickname);
                                break;

                            case "ter":
                                tv3.setText(nickname);
                                break;

                            default:
                                // unknown user
                        }

                        //Toast.makeText(ChatBoxActivity.this, " connected " + nickname+" id = "+id+" all = "+people, Toast.LENGTH_LONG).show();
                    }
                });
            }
        });


        // last user joined. it will receive from previous users their nickname and id.
        socket.on("lastuserjoinedthechat", new Emitter.Listener() {
            @Override
            public void call(final Object... args) {
                getActivity().runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        String nickname = (String) args[0];      //sender nickname
                        String id = (String) args[1];      //sender id
                        JSONObject profile = (JSONObject) args[2];   //sender image profile ={nickname:image profile}
                        // Build the 'ChatUser' object
                        ChatUser chatUser = null;
                        try {
                            chatUser = new ChatUser(nickname, id, profile.getString(nickname));
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }

                        // Add the
                        chatUserList.add(chatUser);

                        // add the new updated list to the adapter
                        chatUserAdapter = new ChatUserAdapter(chatUserList);

                        // notify the adapter to update the recycler view
                        chatUserAdapter.notifyDataSetChanged();

                        //set the adapter for the recycler view
                        myRecylerView.setAdapter(chatUserAdapter);

                        //Response to the sender with 'nickname' and 'id'.
                        //socket.emit("lastuserjoined", nickname, id, Nickname, Id, Profile);
                    }
                });
            }
        });

        //event receiving image from server
        socket.on("send_img", new Emitter.Listener() {
            @Override
            public void call(Object... args) {
                byte[] data = (byte[]) args[0];
                //byte[] b = Base64.decode(data, Base64.DEFAULT);
                //your bitmap data
                final Bitmap bmp = BitmapFactory.decodeByteArray(data, 0, data.length);

                getActivity().runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        // Stuff that updates the UI
                        imageProfile.setImageBitmap(bmp);
                    }
                });
            }
        });

        //Show notification when user diconnect and update the list of the connected users.
        socket.on("userdisconnect", new Emitter.Listener() {
            @Override
            public void call(final Object... args) {
                getActivity().runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        String nickname = (String) args[0];
                        //String nickname = (String) args[1];
                        //people =  (JSONObject)args[0];

                        //System.out.println("*****************after disconnect, the remaining users = "+people);

                        /*
                        Iterator<String> keys = people.keys();
                        while(keys.hasNext()){
                            String nickname_ = (String)keys.next();
                            String id_ = null;
                            try {
                                id_ = people.getString(nickname_);
                            } catch (JSONException e) {
                                e.printStackTrace();
                            }
                            System.out.println("********************************* nickname = "+nickname_+" id = "+id_);
                        }
                         */
                        //Toast.makeText(ChatBoxActivity.this, nickname + " is gone", Toast.LENGTH_LONG).show();

                        //chatUserList.clear();

                        /*
                        //Build the array list of connected users.
                        Iterator<String> keys = people.keys();
                        while(keys.hasNext()){
                            String nickname_ = (String)keys.next();
                            String id_ = null;
                            try {
                                id_ = people.getString(nickname_);
                            } catch (JSONException e) {
                                e.printStackTrace();
                            }
                            ChatUser chatUser = new ChatUser(nickname_, id_, imageProfile);
                            chatUserList.add(chatUser);
                            //System.out.println("********************************* nickname = "+nickname_+" id = "+id_);
                        }
                        */

                        //remove the disconnected user from the list.
                        Iterator<ChatUser> iterator = chatUserList.iterator();
                        while (iterator.hasNext()) {
                            ChatUser chatUser = iterator.next();
                            if (chatUser.getNickname().equals(nickname)) {
                                chatUserList.remove(chatUser);
                                break;
                            }
                        }
                        // updated list to the adapter
                        chatUserAdapter = new ChatUserAdapter(chatUserList);

                        // notify the adapter to update the recycler view
                        chatUserAdapter.notifyDataSetChanged();

                        //set the adapter for the recycler view
                        myRecylerView.setAdapter(chatUserAdapter);
                    }
                });
            }
        });

        //Get the message sent by the user, add it to the message list and update the adapter.
        socket.on("message", new Emitter.Listener() {
            @Override
            public void call(final Object... args) {
                getActivity().runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        JSONObject data = (JSONObject) args[0];
                        try {
                            //extract data from fired event
                            String nickname = data.getString("senderNickname");
                            String id = data.getString("senderId");
                            String message = data.getString("message");

                            // make instance of message
                            Message m = new Message(nickname, id, message);

                            //add the message to the messageList
                            MessageList.add(m);

                            // add the new updated list to the adapter
                            chatBoxAdapter = new ChatBoxAdapter(MessageList);

                            // notify the adapter to update the recycler view
                            chatBoxAdapter.notifyDataSetChanged();

                            //set the adapter for the recycler view
                            myRecylerView.setAdapter(chatBoxAdapter);

                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                });
            }
        });
    }//end onCreateView

    @Override
    public void onViewCreated(View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        tv1 = (TextView)view.findViewById(R.id.tv1);
    }

    public static int calculateInSampleSize(
            BitmapFactory.Options options, int reqWidth, int reqHeight) {
        // Raw height and width of image
        final int height = options.outHeight;
        final int width  = options.outWidth;
        int inSampleSize = 1;

        if (height > reqHeight || width > reqWidth) {

            final int halfHeight = height / 2;
            final int halfWidth  = width / 2;

            // Calculate the largest inSampleSize value that is a power of 2 and keeps both
            // height and width larger than the requested height and width.
            while ((halfHeight / inSampleSize) >= reqHeight
                    && (halfWidth / inSampleSize) >= reqWidth) {
                inSampleSize *= 2;
            }
        }
        return inSampleSize;
    }

    public byte[] convertBitmapToByteArray(Bitmap bitmap) {
        ByteArrayOutputStream stream = null;
        try {
            stream = new ByteArrayOutputStream();
            bitmap.compress(Bitmap.CompressFormat.JPEG, 100, stream);
            return stream.toByteArray();
        }finally {
            if (stream != null) {
                try {
                    stream.close();
                } catch (IOException e) {
                    e.printStackTrace();
                    e.printStackTrace();
                    //Log.e(Helper.class.convertBitmapToByteArray(), "ByteArrayOutputStream was not closed");
                }
            }
        }
    }



    public void displayReceivedData(String message) {
        tv1.setText("Data received: "+message);
    }

    /*
    @Override
    public void finish() {
        // Prepare data intent to send back to 'MainActivity' which has sent this intent 'ChatBoxActivity'
        //Intent data = new Intent();
        //data.putExtra("chat_box_status", chatBoxStatus);
        //setResult(INTENT_RESULT_OK_CHATBOX_ACTIVITY, data); //the data are returned to 'onActivityResult' of 'MainActivity'.
        super.finish();
    }
    */
    @Override
    public void onDestroy() {
        super.onDestroy();
        //socket.emit("disconnect", Nickname);
        socket.disconnect();
  }
}
