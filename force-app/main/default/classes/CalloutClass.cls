public with sharing class CalloutClass {
   @AuraEnabled
   public static String getContact() {
       HttpRequest httpRequest = new HttpRequest();
       httpRequest.setEndpoint('https://node-lwc-mdb.herokuapp.com/');
       httpRequest.setMethod('GET');
       Http http = new Http();
       HTTPResponse res = http.send(httpRequest);
       String response =   String.valueOf(res.getBody());
       return response;
   }
   @AuraEnabled
   public static String createContact(String body) {
       HttpRequest httpRequest = new HttpRequest();
       httpRequest.setEndpoint('https://node-lwc-mdb.herokuapp.com/api/contacts/create');
       httpRequest.setMethod('POST');
       httpRequest.setHeader('Content-Type','application/json');
       httpRequest.setBody(body);
       Http http = new Http();
       HTTPResponse res = http.send(httpRequest);
       String response =   String.valueOf(res.getStatus());
       System.debug(response);
       return response;
   }
   @AuraEnabled 
   public static User getUser() {
     return [Select id,name,email from user where id =:UserInfo.getUserId()];
   }
   @AuraEnabled 
   public static String deleteRecord(String recid) {
    HttpRequest httpRequest = new HttpRequest();
    httpRequest.setEndpoint('https://node-lwc-mdb.herokuapp.com/api/contact/'+recid);
    httpRequest.setMethod('DELETE');
    Http http = new Http();
    HTTPResponse res = http.send(httpRequest);
    String response =   String.valueOf(res.getStatus());
    System.debug(response);
    return response;
   }
}
