/**
 * Created by saharmehrpour on 9/8/17.
 */

class Utilities {

    /**
     * send the message to the server
     * @param ws web socket
     * @param command
     * @param data
     */
    static sendToServer(ws, command, data) {
        let messageJson = {"source": "WEB", "destination": "IDEA", "command": command};

        if (ws) {
            switch (command) {
                case 'MODIFIED_RULE':
                    messageJson['data'] = {
                        "index": data.index,
                        "ruleText": data
                    };
                    break;
                case 'MODIFIED_TAG':
                    messageJson['data'] = {
                        "tagName": data.tagName,
                        "tagText": data
                    };
                    break;
                case 'XML_RESULT':
                    messageJson['data'] = data;
                    break;
                default:
                    break;
            }

            // console.log(messageJson);
            ws.send(JSON.stringify(messageJson));
        }
    }

    /**
     * check whether two arrays are equals
     * @param array1
     * @param array2
     * @returns {boolean}
     */
    static ResultArraysEqual(array1, array2) {

        let arr1 = array1.slice(0);
        let arr2 = array2.slice(0);

        if (arr1.length !== arr2.length)
            return false;
        for (let i = arr2.length; i--;) {

            let item = arr1.filter((d) => d.name === arr2[i].name);
            if (item.length === 0)
                return false;

            // only remove one occurrence
            let removed = false;
            arr1 = arr1.filter((d) => {
                if (!removed && d.name === arr2[i].name) {
                    removed = !removed;
                    return false;
                }
                return true;
            });
        }
        return true;
    }

    /**
     * deep copy of an xml variable
     * @param xml
     * @returns {Document}
     */
    static cloneXML(xml) {
        let newDocument = xml.implementation.createDocument(
            xml.namespaceURI, //namespace to use
            "",                     //name of the root element (or for empty document)
            null                      //doctype (null for XML)
        );
        let newNode = newDocument.importNode(
            xml.documentElement, //node to import
            true                         //clone its descendants
        );
        newDocument.appendChild(newNode);

        return newDocument;
    }

}


export default Utilities;