# Changelog

## [1.3.0] - 2023-03-16
Tested on 
- Node-RED v2.1.5, Node v12.20.1  
- Node-RED v3.0.2, Node v16.19.1
- Rasa v3.0.5

### Added

- <code>simrasa</code> node: it sends a rasa-like message to the action server allowing actions to be tested without actually running rasa
- an example flow
- improved error handling: error messages sent to <code>catch</code> node now include descriptions of the errors
- moved from Apache 2.0 to MIT license, added a License note to source files

### Fixed

- typos
- source code formatting