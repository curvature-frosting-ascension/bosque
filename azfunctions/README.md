### TODO
* Find a way to correctly measure the usage and bill of Adobe services at the time.

### Functions
This azure function has following http endpoints.
* /parse-pdf
  * `/parse-pdf?help=true` to see the help.

### Setup
Following environment variables must be defined.
<dl>
  <dt>AdobePdfExtractApiAccountId</dt>
  <dt>AdobePdfExtractApiClientId</dt>
  <dt>AdobePdfExtractApiClientSecret</dt>
  <dt>AdobePdfExtractApiOrganizationId</dt>
  <dd>There are Adobe PDF Extract API's credentials.</dd>
  <dt>AdobePdfExtractApiPrivateKey</dt>
  <dd>
    Insert the content of the PEM file. There should be <code>\n</code> after <code>-----BEGIN PRIVATE KEY-----</code> and before <code>-----END PRIVATE KEY-----</code>. 
    Note that azure functions' application setting escapes <code>\</code> automatically. Use `advanced edit` to directly edit the json file.
  </dd>
</dl>
