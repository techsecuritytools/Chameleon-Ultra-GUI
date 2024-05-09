export default class Keys {
    
    constructor(){
        this.allKeys = []
    }

    static getKeys(){
        fetch('/Keys.txt')  // Adjust the path if your file is deeper in the structure
            .then(response => {
                if (response.ok) {
                console.log('text ',response)
                return response.text();
                }
                throw new Error('Network response was not ok.');
            })
            .then(text => console.log())
            .catch(error => console.log('Failed to load file: ' + error.message));
            }

    static getCountKeys(){

    }

    static getSpecificKeyByIndex(index){

    }
}
