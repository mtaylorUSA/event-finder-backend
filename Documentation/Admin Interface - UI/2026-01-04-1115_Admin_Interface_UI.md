\# Admin Interface



I would like to update the admin interface to facilitate navigation and workflow.  Let's do this:





---





\# Header

     \* Page Header is a hyperlink back to the main screen/home page / Dashboard





---





\# Dashboard

     \* Specify tiles that are links to pages







---





\# Add a Tab called "Organization By Status."

     \* The "Organization By Status" tab page defaults to a list of all organizations, sorted in alphabetical order.

          \*\* Ignore the word "The" in the organization name when sorting

     \* The "Organization By Status" tab page has a modified drop-down list to sort/filter:

          \*\* All Organizations

          \*\* Nominated (Pending Mission Review)

          \*\* Mission Approved (Request Not Sent)

          \*\* Permission Requested (Pending Org Response)

          \*\* Permission Granted/Implied (Not Live)

          \*\* Rejected (By Mission or Org)

          \*\* Live (Scraping Active)





---





\# When a status is selected picked, the list re-sorts

     \* All Organizations List. Each Organization on the list has these items:

          \*\* Alerts

          \*\* Organization Name: Links to the Organization's Profile Page / Organization Overview Tab

          \*\* Current Status:

          \*\* Org Description:

          \*\* Website: hyperlink to Org's website

          \*\* Warnings or Alerts (TOU, etc.)

          \*\* Status Dropdown:

               \*\*\* List defaults to its current status

                    \*\*\*\* Nominated (Pending Mission Review)

                    \*\*\*\* Mission Approved (Request Not Sent)

                    \*\*\*\* Permission Requested (Pending Org Response)

                    \*\*\*\* Permission Granted (Not Live)

                    \*\*\*\* Rejected (By Mission or Org)

                    \*\*\*\* Live (Scraping Active)

               \*\*\* Allows me to change the status of the Org on the fly.

          \*\* Button: \[Edit Org]: Links to the Organization's Profile Page / Organization Overview Tab

          \*\* Button:  \[Edit Org Contacts]: Links to the Organization's Profile Page / Contacts Tab

          \*\* Button: \[Edit Orgg Status]: Links to the Organization's Profile Page / Status and History Tab

          \*\* Button: \[See Org Events]: Links to the Organization's Profile Page / Events Tab





     \* Nominated (Pending Mission Review) List. Each Organization on the List has these items:

          \*\* Warnings or Alerts (TOU, etc.)

          \*\* Organization Name: Links to the Organization's Profile Page / Organization Overview Tab

          \*\* Current Status:

          \*\* Org Description:

          \*\* Website: hyperlink to Org's website

          \*\* AI Reasoning:

          \*\* Status Dropdown:

               \*\*\* List defaults to its current status

                    \*\*\*\* Nominated (Pending Mission Review)

                    \*\*\*\* Mission Approved (Request Not Sent)

                    \*\*\*\* Permission Requested (Pending Org Response)

                    \*\*\*\* Permission Granted (Not Live)

                    \*\*\*\* Rejected (By Mission or Org)

                    \*\*\*\* Live (Scraping Active)

          \*\* Button: \[Edit Org]: Links to the Organization's Profile Page / Organization Overview Tab

          \*\* Button:  \[Edit Org Contacts]: Links to the Organization's Profile Page / Contacts Tab

          \*\* Button: \[Edit Org Status]: Links to the Organization's Profile Page / Status and History Tab

          \*\* Button: \[See Org Events]: Links to the Organization's Profile Page / Events Tab

          \*\* "Approve Mission" button.  Color Red. Changes the status to "Mission Approved (Request Not Sent)







     \* Mission Approved (Request Not Sent) List. Each Organization on the List has these items:

          \*\* Warnings or Alerts (TOU, etc.)

          \*\* Organization Name: Links to the Organization's Profile Page / Organization Overview Tab

          \*\* Current Status:

          \*\* Org Description:

          \*\* Website: hyperlink to Org's website

          \*\* Request sent date

          \*\* Status Dropdown:

               \*\*\* List defaults to its current status

                    \*\*\*\* Nominated (Pending Mission Review)

                    \*\*\*\* Mission Approved (Request Not Sent)

                    \*\*\*\* Permission Requested (Pending Org Response)

                    \*\*\*\* Permission Granted (Not Live)

                    \*\*\*\* Rejected (By Mission or Org)

                    \*\*\*\* Live (Scraping Active)

               \*\*\* Allows me to change the status of the Org on the fly.



          \*\* Button: \[Edit Org]: Links to the Organization's Profile Page / Organization Overview Tab

          \*\* Button:  \[Edit Org Contacts]: Links to the Organization's Profile Page / Contacts Tab

          \*\* Button: \[Edit Org Status]: Links to the Organization's Profile Page / Status and History Tab

          \*\* Button: \[See Org Events]: Links to the Organization's Profile Page / Events Tab

          \*\* "Generate Request" button: Color Red.   Links to the Organization's Profile Page / Status and History Tab









     \* Permission Requested (Pending Org Response) List. Each Organization on The List has these items:

          \*\* Warnings or Alerts (TOU, etc.)

          \*\* Organization Name: Links to the Organization's Profile Page / Organization Overview Tab

          \*\* Current Status:

          \*\* Org Description:

          \*\* Website: hyperlink to Org's website

          \*\* Request sent date:

          \*\* Go Live Date (sent date + two weeks)

          \*\* Status Dropdown:

               \*\*\* List defaults to its current status

                    \*\*\*\* Nominated (Pending Mission Review)

                    \*\*\*\* Mission Approved (Request Not Sent)

                    \*\*\*\* Permission Requested (Pending Org Response)

                    \*\*\*\* Permission Granted (Not Live)

                    \*\*\*\* Rejected (By Mission or Org)

                    \*\*\*\* Live (Scraping Active)

               \*\*\* Allows me to change the status of the Org on the fly.

          \*\* Button: \[Edit Org]: Links to the Organization's Profile Page / Organization Overview Tab

          \*\* Button:  \[Edit Org Contacts]: Links to the Organization's Profile Page / Contacts Tab

          \*\* Button: \[Edit Org Status]: Links to the Organization's Profile Page / Status and History Tab

          \*\* Button: \[See Org Events]: Links to the Organization's Profile Page / Events Tab









     \* Permission Granted/Implied (Not Live) List.  Each Organization on the List has these items:

          \*\* Organizations that have not replied in the 2-week response window should automatically get put into this status.

          \*\* Field to indicate if an org provided agreement or is being scraped by default.

          \*\* Warnings or Alerts (TOU, etc.)

          \*\* Organization Name: Links to the Organization's Profile Page / Organization Overview Tab

          \*\* Current Status

          \*\* Org Description:

          \*\* Status Dropdown:

               \*\*\* List defaults to its current status

                    \*\*\*\* Nominated (Pending Mission Review)

                    \*\*\*\* Mission Approved (Request Not Sent)

                    \*\*\*\* Permission Requested (Pending Org Response)

                    \*\*\*\* Permission Granted (Not Live)

                    \*\*\*\* Rejected (By Mission or Org)

                    \*\*\*\* Live (Scraping Active)

 

     \* Rejected (By Mission or Org).  Each Organization on the List has these items:

          \*\* Warnings or Alerts (TOU, etc.)

          \*\* Organization Name: Links to the Organization's Profile Page / Organization Overview Tab

          \*\* Current Status

          \*\* Org Description:

          \*\* Website: hyperlink to Org's website

          \*\* POCs: Name and/or Title, Phone, email address(es)

          \*\* Reason for rejection: Mission Rejected or Permission Rejected

          \*\* Status Dropdown:

               \*\*\* List defaults to its current status

                    \*\*\*\* Nominated (Pending Mission Review)

                    \*\*\*\* Mission Approved (Request Not Sent)

                    \*\*\*\* Permission Requested (Pending Org Response)

                    \*\*\*\* Permission Granted (Not Live)

                    \*\*\*\* Rejected (By Mission or Org)

                    \*\*\*\* Live (Scraping Active)

          \*\* Button: \[Edit Org]: Links to the Organization's Profile Page / Organization Overview Tab

          \*\* Button:  \[Edit Org Contacts]: Links to the Organization's Profile Page / Contacts Tab

          \*\* Button: \[Edit Org Status]: Links to the Organization's Profile Page / Status and History Tab

          \*\* Button: \[See Org Events]: Links to the Organization's Profile Page / Events Tab





     \* Live (Scraping Active) List.  Each Organization on the List has these items:

          \*\* Warnings or Alerts (TOU, etc.)

          \*\* Organization Name: Links to the Organization's Profile Page / Organization Overview Tab

          \*\* Current Status

          \*\* Org Description:

          \*\* Website: hyperlink to Org's website

          \*\* Status Dropdown:

               \*\*\* List defaults to its current status

                    \*\*\*\* Nominated (Pending Mission Review)

                    \*\*\*\* Mission Approved (Request Not Sent)

                    \*\*\*\* Permission Requested (Pending Org Response)

                    \*\*\*\* Permission Granted (Not Live)

                    \*\*\*\* Rejected (By Mission or Org)

                    \*\*\*\* Live (Scraping Active)

          \*\* Button: \[Edit Org]: Links to the Organization's Profile Page / Organization Overview Tab

          \*\* Button:  \[Edit Org Contacts]: Links to the Organization's Profile Page / Contacts Tab

          \*\* Button: \[Edit Org Status]: Links to the Organization's Profile Page / Status and History Tab

          \*\* Button: \[See Org Events]: Links to the Organization's Profile Page / Events Tab





---

 



\# Organizations Tab

     \* Org List Parameters

          \*\* The "Organization" tab page defaults to a list of all organizations, sorted in alphabetical order.

               \*\*\* Ignore the word "The" in the organization name when sorting

          \*\* Quick Search by name

          \*\* Drop Down to get to Organization by name

          \*\* Drop Down to get to Organizations by status (NOTE functionality then uses the "Organization Status" tab rules.

          \*\* Button: \[Add Organization].

               \*\*\* Links to Blank Organization's Profile Page / Organization Overview Tab.

               \*\*\* Status Defaults to Nominated (Pending Mission Review)





     \* Organization Entries on the List.  Each Organization on the List has the following:

          \*\* Warnings or Alerts (TOU, etc.)

          \*\* Org Name: Links to the Organization's Profile Page / Organization Overview Tab

          \*\* Current Status:

          \*\* Org Description:

          \*\* Website: hyperlink to Org's website

          \*\* Org Main Phone Number

          \*\* Status Dropdown:

               \*\*\* List defaults to its current status

               \*\*\* Nominated (Pending Mission Review)

               \*\*\* Mission Approved (Request Not Sent)

               \*\*\* Permission Requested (Pending Org Response)

               \*\*\* Permission Granted (Not Live)

               \*\*\* Rejected (By Mission or Org)

               \*\*\* Live (Scraping Active)

          \*\* Button: \[Edit Org]: Links to the Organization's Profile Page / Organization Overview Tab

          \*\* Button: \[Edit Org Contacts]: Links to the Organization's Profile Page / Contacts Tab

               \*\*\* This tab shows a list of all contacts related to the Organization

          \*\* Button: \[Edit Org Status]: Links to the Organization's Profile Page / Status and History Tab

          \*\* Button: \[See Org Events]: Links to the Organization's Profile Page / Events Tab





---

 



\# Org Profile Page (currently the "Edit Organization" page)

     \* Each organization has its own page with Tabs

          \*\* Organization Overview Tab

          \*\* Contacts Tab

          \*\* Status and History Tab

          \*\* Events Tab



     \* Org Overview Tab

          \*\* Warnings or Alerts (TOU, etc.):

          \*\* Org Name:

          \*\* Org Description:

          \*\* Website: hyperlink to Org's website

          \*\* Type:

          \*\* Source Id (domain):

          \*\* Events URL:

          \*\* Status Dropdown:

               \*\*\* List defaults to its current status

                    \*\*\*\* Nominated (Pending Mission Review)

                    \*\*\*\* Mission Approved (Request Not Sent)

                    \*\*\*\* Permission Requested (Pending Org Response)

                    \*\*\*\* Permission Granted (Not Live)

                    \*\*\*\* Rejected (By Mission or Org)

                    \*\*\*\* Live (Scraping Active)



     \* Org Contacts Tab

          \*\* Sorted in Alphabetical Order by Last name

          \*\* Drop down to sort by:

               \*\*\* Last Name

               \*\*\* First Name

 

          \*\* Org Section

               \*\*\* Warnings or Alerts (TOU, etc.):

               \*\*\* Org Name: 

               \*\*\* Org Status:



          \*\* Contact Info

               \*\*\* Contact Name

               \*\*\* Contact Role/Position

               \*\*\* Contact: email

               \*\*\* Contact: phone number

               \*\*\* Contact: notes

               \*\*\* Button: \[Edit Contact]

               \*\*\* Button: \[Add Contact]



     \* Org Status and History Tab

          \*\* General Info Section

               \*\*\* Warnings or Alerts (TOU, etc.):

               \*\*\* Org Name: 

               \*\*\* Status:

               \*\*\* Website: hyperlink to Org's website

               \*\*\* AI Reasoning: why AI suggested this org...



          \*\* TOU Assessment Section

               \*\*\* TOU/User Agreement Scanned Date: Autogenerated

               \*\*\* TOU Flag: May Prohibit Scraping, etc.:  Autogenerated

               \*\*\* TOU Notes: Autogenerated



          \*\* Permission Request Section

               \*\*\* Permission Requested Date:

               \*\*\* Permission Request Draft Text:

               \*\*\* Permission Request Final Text:



               \*\*\* Permission Response Date:

               \*\*\* Permission Response Text:



               \*\*\* Button: \[Generate Request]

               \*\*\* Generates new draft

               \*\*\* Button: \[Copy Draft]

               \*\*\* Button: \[Preview]

               \*\*\* Button: \[Edit Draft]





          \*\* Scraping Notes:

               \*\*\* Number of Scrapes:

               \*\*\* Date of Last Scrape:

               \*\*\* Scraping Notes:



          \*\* Status Dropdown:

               \*\*\* List defaults to its current status

                    \*\*\*\* Nominated (Pending Mission Review)

                    \*\*\*\* Mission Approved (Request Not Sent)

                    \*\*\*\* Permission Requested (Pending Org Response)

                    \*\*\*\* Permission Granted (Not Live)

                    \*\*\*\* Rejected (By Mission or Org)

                    \*\*\*\* Live (Scraping Active)



     \* Org Events Tab

&nbsp;         \*\* Sort chronologically by start date with newest events on top.

          \*\* General Info Section

               \*\*\* Warnings or Alerts (TOU, etc.):

               \*\*\* Org Name: 

               \*\*\* Status:

               \*\*\* Website: hyperlink to Org's website

               \*\*\* AI Reasoning: why AI suggested this org...



          \*\* Events Info Section

               \*\*\* Title of Event

               \*\*\* Dates of Event 

               \*\*\* All other event details used in the UI





---

 



\# (All) Contacts List Tab (Main Screen) - List of All contacts

     \* Sorting

     \* Editing



     \* List items contain

          \*\* Contact Info

               \*\*\* Contact Name:

               \*\*\* Contact Position/Title: CEO, President, etc.

               \*\*\* Contact Role: Leadership, Events, Legal/Permissions, Media/PR, Main Contact, Other 

               \*\*\* Contact: email

               \*\*\* Contact: phone number

               \*\*\* Contact: notes

               \*\*\* Button: \[Edit Contact]

               \*\*\* Button: \[Add Contact]





---

 



\# (All) Events List Tab (main Screen)

&nbsp;    \* (All) Events List Parameters

          \*\* The "Events" tab page defaults to a list of all events, sorted chronologically by start date with newest events on top.

          \*\* Quick Search by name

&nbsp;         \*\* Drop Down to get to Events by:

&nbsp;              \*\*\* Start date

               \*\*\* Organization 

               \*\*\* Topic/Region

&nbsp;         \*\* Button: \[Add Event]: Links to a blank event form.





     \* (All) Events Entries on the List.  

&nbsp;         \*\* Each Event on the List will display as it does on the main UI

          \*\* Button: \[Edit Org]: Links to the Organization's Profile Page / Organization Overview Tab

          \*\* Button: \[Edit Org Contacts]: Links to the Organization's Profile Page / Contacts Tab

               \*\*\* This tab shows a list of all contacts related to the Organization

          \*\* Button: \[Edit Org Status]: Links to the Organization's Profile Page / Status and History Tab

          \*\* Button: \[See Org Events]: Links to the Organization's Profile Page / Events Tab





---





\# Individual POC Contact



     \* Leadership, Events, Legal/Permissions, Media/PR, Other

