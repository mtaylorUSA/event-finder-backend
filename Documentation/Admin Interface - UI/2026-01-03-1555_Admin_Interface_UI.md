\# Admin Interface



I would like to update the admin interface to facilitate navigation and workflow.  Let's do this:





-----

&nbsp;



\# Add a Tab called "Organization By Status." 

&nbsp;    \* The "Organization By Status" tab page defaults to a list of all organizations, sorted in alphabetical order.

&nbsp;         \*\* Ignore the word "The" in the organization name when sorting

&nbsp;    \* The "Organization By Status" tab page has a modified drop-down list to sort/filter: 

&nbsp;         \*\* All Organizations 

&nbsp;         \*\* Nominated (Pending Mission Review)

&nbsp;         \*\* Mission Approved (Request Not Sent)

&nbsp;         \*\* Permission Requested (Pending Org Response)

&nbsp;         \*\* Permission Granted/Implied (Not Live)

&nbsp;         \*\* Rejected (By Mission or Org)

&nbsp;         \*\* Live (Scraping Active)





-----





\# When a status is selected picked, the list re-sorts

&nbsp;    \* All Organizations List. Each Organization on the list has these items:

          \*\* Alerts

          \*\* Organization Name: Links to the Organization's Profile Page / Organization Overview Tab

          \*\* Current Status:

          \*\* Org Description:

          \*\* Website: hyperlink to Org's website

&nbsp;         \*\* Warnings or Alerts (TOU, etc.)

&nbsp;         \*\* Status Dropdown: 

&nbsp;              \*\*\* List defaults to its current status

                    \*\*\*\* Nominated (Pending Mission Review)

                    \*\*\*\* Mission Approved (Request Not Sent)

                    \*\*\*\* Permission Requested (Pending Org Response)

                    \*\*\*\* Permission Granted (Not Live)

                    \*\*\*\* Rejected (By Mission or Org)

                    \*\*\*\* Live (Scraping Active)

&nbsp;              \*\*\* Allows me to change the status of the Org on the fly.

          \*\* Button: \[Edit Org]: Links to the Organization's Profile Page / Organization Overview Tab

          \*\* Button:  \[Edit Org Contacts]: Links to the Organization's Profile Page / Contacts Tab

          \*\* Button: \[Edit Orgg Status]: Links to the Organization's Profile Page / Status and History Tab

          \*\* Button: \[See Org Events]: Links to the Organization's Profile Page / Events Tab





&nbsp;    \* Nominated (Pending Mission Review) List. Each Organization on the List has these items:

          \*\* Warnings or Alerts (TOU, etc.)

          \*\* Organization Name: Links to the Organization's Profile Page / Organization Overview Tab

          \*\* Current Status:

          \*\* Org Description:

          \*\* Website: hyperlink to Org's website

&nbsp;         \*\* AI Reasoning:  

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

&nbsp;         \*\* "Approve Mission" button.  Color Red. Changes the status to "Mission Approved (Request Not Sent) 







&nbsp;    \* Mission Approved (Request Not Sent) List. Each Organization on the List has these items:

          \*\* Warnings or Alerts (TOU, etc.)

          \*\* Organization Name: Links to the Organization's Profile Page / Organization Overview Tab

          \*\* Current Status:

          \*\* Org Description:

          \*\* Website: hyperlink to Org's website

&nbsp;         \*\* Request sent date 

          \*\* Status Dropdown:

               \*\*\* List defaults to its current status

                    \*\*\*\* Nominated (Pending Mission Review)

                    \*\*\*\* Mission Approved (Request Not Sent)

                    \*\*\*\* Permission Requested (Pending Org Response)

                    \*\*\*\* Permission Granted (Not Live)

                    \*\*\*\* Rejected (By Mission or Org)

                    \*\*\*\* Live (Scraping Active)

&nbsp;              \*\*\* Allows me to change the status of the Org on the fly.



          \*\* Button: \[Edit Org]: Links to the Organization's Profile Page / Organization Overview Tab

          \*\* Button:  \[Edit Org Contacts]: Links to the Organization's Profile Page / Contacts Tab

          \*\* Button: \[Edit Org Status]: Links to the Organization's Profile Page / Status and History Tab

          \*\* Button: \[See Org Events]: Links to the Organization's Profile Page / Events Tab

          \*\* "Generate Request" button: Color Red.   Links to the Organization's Profile Page / Status and History Tab









&nbsp;    \* Permission Requested (Pending Org Response) List. Each Organization on The List has these items:

          \*\* Warnings or Alerts (TOU, etc.)

          \*\* Organization Name: Links to the Organization's Profile Page / Organization Overview Tab

          \*\* Current Status:

          \*\* Org Description:

          \*\* Website: hyperlink to Org's website

&nbsp;         \*\* Request sent date:

&nbsp;         \*\* Go Live Date (sent date + two weeks)

          \*\* Status Dropdown:

               \*\*\* List defaults to its current status

                    \*\*\*\* Nominated (Pending Mission Review)

                    \*\*\*\* Mission Approved (Request Not Sent)

                    \*\*\*\* Permission Requested (Pending Org Response)

                    \*\*\*\* Permission Granted (Not Live)

                    \*\*\*\* Rejected (By Mission or Org)

                    \*\*\*\* Live (Scraping Active)

&nbsp;              \*\*\* Allows me to change the status of the Org on the fly.

          \*\* Button: \[Edit Org]: Links to the Organization's Profile Page / Organization Overview Tab

          \*\* Button:  \[Edit Org Contacts]: Links to the Organization's Profile Page / Contacts Tab

          \*\* Button: \[Edit Org Status]: Links to the Organization's Profile Page / Status and History Tab

          \*\* Button: \[See Org Events]: Links to the Organization's Profile Page / Events Tab









&nbsp;    \* Permission Granted/Implied (Not Live) List.  Each Organization on the List has these items:

&nbsp;         \*\* Organizations that have not replied in the 2-week response window should automatically get put into this status.

&nbsp;         \*\* Field to indicate if an org provided agreement or is being scraped by default.

          \*\* Warnings or Alerts (TOU, etc.)

          \*\* Organization Name: Links to the Organization's Profile Page / Organization Overview Tab

          \*\* Current Status

&nbsp;         \*\* Org Description:

          \*\* Status Dropdown:

               \*\*\* List defaults to its current status

                    \*\*\*\* Nominated (Pending Mission Review)

                    \*\*\*\* Mission Approved (Request Not Sent)

                    \*\*\*\* Permission Requested (Pending Org Response)

                    \*\*\*\* Permission Granted (Not Live)

                    \*\*\*\* Rejected (By Mission or Org)

                    \*\*\*\* Live (Scraping Active)

&nbsp;    

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





-----

&nbsp;



\# Organizations Tab 

&nbsp;    \* Org List

&nbsp;         \*\* The "Organization" tab page defaults to a list of all organizations, sorted in alphabetical order.

               \*\*\* Ignore the word "The" in the organization name when sorting



          \*\* Filter / Sort Options:

&nbsp;              \*\*\* Quick Search by name

               \*\*\* Drop Down to get to Organization by name

               \*\*\* Drop Down to get to Organizations by status (NOTE functionality then uses the "Organization Status" tab rules.

&nbsp;         \*\* Button: \[Add Organization].  

               \*\*\* Links to Blank Organization's Profile Page / Organization Overview Tab.

               \*\*\* Status Defaults to Nominated (Pending Mission Review)





&nbsp;    \* Organization Entries on the List.  Each Organization on the List has the following:

          \*\* Warnings or Alerts (TOU, etc.)

          \*\*Org Name: Links to the Organization's Profile Page / Organization Overview Tab

          \*\* Current Status:

          \*\* Org Description:

          \*\* Org Type

          \*\* Website: hyperlink to Org's website

          \*\* Source ID (Domain):

          \*\* Events URL:

          \*\* Org Address

          \*\* Org Main Phone Number

          \*\* Status Dropdown:

&nbsp;              \*\*\* List defaults to its current status

               \*\*\* Nominated (Pending Mission Review)

               \*\*\* Mission Approved (Request Not Sent)

               \*\*\* Permission Requested (Pending Org Response)

               \*\*\* Permission Granted (Not Live)

               \*\*\* Rejected (By Mission or Org)

               \*\*\* Live (Scraping Active)

&nbsp;         \*\* Button: \[Edit Org]: Links to the Organization's Profile Page / Organization Overview Tab

          \*\* Button:  \[Edit Org Contacts]: Links to the Organization's Profile Page / Contacts Tab

          \*\* Button: \[Edit Org Status]: Links to the Organization's Profile Page / Status and History Tab

          \*\* Button: \[See Org Events]: Links to the Organization's Profile Page / Events Tab





-----

&nbsp;



\# Organization Profile Page (currently the "Edit Organization" page)

&nbsp;    \* Each organization has its own page with Tabs

&nbsp;         \*\* Organization Overview Tab

          \*\* Contacts Tab

          \*\* Status and History Tab

          \*\* Events Tab



&nbsp;    \* Organization Overview Tab

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



     \* Contacts Tab

          \*\* Warnings or Alerts (TOU, etc.):

          \*\* Org Name: 

&nbsp;         \*\* Status:

&nbsp;         \*\* POC Name, Role/Position, email, phone number, notes 

          \*\* POC Name, Role/Position, email, phone number, notes

          \*\* POC Name, Role/Position, email, phone number, notes

          \*\* Add POC Info button



     \* Status and History Tab

&nbsp;         \*\* General Info Section 

&nbsp;              \*\*\* Warnings or Alerts (TOU, etc.):

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



&nbsp;         \*\* Button: \[Generate Request]

               \*\* Generates new draft

&nbsp;              \*\* Button: \[Copy Draft]

               \*\* Button: \[Preview]

               \*\* Button: \[Edit Draft]





     \* Events Tab

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





-----

&nbsp;



\# Contacts Profile Page (TBD)





-----

