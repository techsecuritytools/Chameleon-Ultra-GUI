export default class Keys {
    static allKeys = [];

    static async loadKeys() {
        try {
            const response = await fetch('/Keys.txt');  // Adjust the path if necessary
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const text = await response.text();
            this.allKeys = text
        } catch (error) {
            console.log('Failed to load keys:', error.message);
        }
    }
    

    static getKeys(){
        return this.allKeys;
            }

    static getCountKeys(){
    }

    static getSpecificKeyByIndex(index){

    }
}
