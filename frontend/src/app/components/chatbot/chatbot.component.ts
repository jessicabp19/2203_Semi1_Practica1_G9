import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit {

  constructor() { }

  message:string = "";
  conversation:string="";
  ngOnInit(): void {
  }

  startChat(){
    console.log("chat");
    this.conversation = this.conversation + "\nYou::" + this.message;
    var response = {message:"El bot no se encuentra disponible en este momento :c"};//await Interactions.send("hotelbooking_dev", this.message.toString());
    console.log(response);
    this.message = '';
    if(response && response.message){
      this.conversation = this.conversation + "\nBot::" + response.message
    }
    if(response && !response.message){
      this.conversation = this.conversation + "\nBot::" + "Your Hotel Room Booking is complete."
    }
  }
}
