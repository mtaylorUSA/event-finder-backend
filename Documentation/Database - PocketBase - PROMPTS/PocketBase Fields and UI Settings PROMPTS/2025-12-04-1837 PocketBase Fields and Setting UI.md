
## PocketBase Field Types Reference

### Plain Text (T icon)

| Setting | Type | Notes |
|---------|------|-------|
| name | text box | Field name |
| min length | text box | Optional minimum |
| max length | text box | Optional maximum |
| Regex pattern | text box | Optional validation |
| Nonempty | toggle on/off | Required field |
| Presentable | toggle on/off | Show in list view |



### Rich Editor (✏️ pencil icon)

| Setting | Type | Notes |
|---------|------|-------|
| name | text box | Field name |
| Nonempty | toggle on/off | Required field |
| Presentable | toggle on/off | Show in list view |
| strip urls domain | toggle on/off | Remove domain from URLs |



### Number (# icon)

| Setting | Type | Notes |
|---------|------|-------|
| name | text box | Field name |
| Min | text box | Minimum value |
| Max | text box | Maximum value |
| Nonzero | toggle on/off | Cannot be zero |
| Presentable | toggle on/off | Show in list view |
| No decimals | toggle on/off | Integers only |



### Bool (toggle icon)

| Setting | Type | Notes |
|---------|------|-------|
| name | text box | Field name |
| Nonfalsey | toggle on/off | Must be true |
| Presentable | toggle on/off | Show in list view |



### Email (✉️ envelope icon)

| Setting | Type | Notes |
|---------|------|-------|
| name | text box | Field name |
| Except domains | text box | Block specific domains |
| Only domains | text box | Allow only specific domains |
| Nonempty | toggle on/off | Required field |
| Presentable | toggle on/off | Show in list view |



### URL (🔗 chain link icon)

| Setting | Type | Notes |
|---------|------|-------|
| name | text box | Field name |
| Except domains | text box | Block specific domains |
| Only domains | text box | Allow only specific domains |
| Nonempty | toggle on/off | Required field |
| Presentable | toggle on/off | Show in list view |



### DateTime (📅 calendar icon)

| Setting | Type | Notes |
|---------|------|-------|
| name | text box | Field name |
| min date (UTC) | text box | Earliest allowed date |
| max date (UTC) | text box | Latest allowed date |
| Nonempty | toggle on/off | Required field |
| Presentable | toggle on/off | Show in list view |



### Select (☰ bullet list icon)

| Setting | Type | Notes |
|---------|------|-------|
| name | text box | Field name |
| Choices | text box | **Items must be entered in a single line, separated by commas** (e.g., `Option A, Option B, Option C`) |
| Single/multiple | picklist | Allow one or many selections |
| Nonempty | toggle on/off | Required field |
| Presentable | toggle on/off | Show in list view |



### File (🖼️ picture icon)

| Setting | Type | Notes |
|---------|------|-------|
| name | text box | Field name |
| Single/multiple | picklist | Allow one or many files |
| Allowed types | picklist | Restrict file types |
| Choose presets | picklist | Common type presets |
| thumb sizes | text box | Thumbnail dimensions |
| Max file size | text box | **Value must be in bytes** (see conversion table below) |
| Nonempty | toggle on/off | Required field |
| Presentable | toggle on/off | Show in list view |
| Protected | toggle on/off | Require auth to access |



**File Size Conversion Table:**

| Size | Bytes |
|------|-------|
| 1 MB | `1048576` |
| 5 MB | `5242880` |
| 10 MB | `10485760` |
| 25 MB | `26214400` |
| 50 MB | `52428800` |



### Relation (⤳ flow chart connector icon)

| Setting | Type | Notes |
|---------|------|-------|
| name | text box | Field name |
| Select Collection | picklist | Target collection |
| Single/multiple | picklist | One or many relations |
| Cascade delete | picklist true/false | Delete related records |
| Nonempty | toggle on/off | Required field |
| Presentable | toggle on/off | Show in list view |



### JSON ({} icon)

| Setting | Type | Notes |
|---------|------|-------|
| name | text box | Field name |
| Max size (bytes) | text box | Maximum JSON size |
| String value normalizations | picklist | Normalization options |
| Nonempty | toggle on/off | Required field |
| Presentable | toggle on/off | Show in list view |

---

## How to Add a New Collection to PocketBase

1. Click **"+ New collection"** button
2. Add name
3. Specify Type:
   - Base Collection
   - View Collection
   - Auth Collection
4. Use the **"Fields"** tab (not the "API Rules" tab)
5. Add at least one field (required to save)
6. Click the **"Create"** button

---

## How to Add a New Field in PocketBase

1. Go to PocketBase Admin → Collections
2. Click the collection name
3. Click **"New field"**
4. Choose field type (icons above)
5. Enter field name
6. Click **sprocket icon** ⚙️ for settings
7. Configure settings as needed
8. Click **"Save"**

---

## How to Add a New Record to a Collection

1. Click on the named Collection
2. Click **"+ New record"** button
3. Fill in field values
4. Click **"Save"**

---

## How to Review APIs

1. Click on the named Collection
2. Click **"</> API Preview"** button
