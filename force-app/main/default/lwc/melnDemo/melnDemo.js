import { LightningElement, track } from 'lwc';
import getContact from '@salesforce/apex/CalloutClass.getContact'
import createContact from '@salesforce/apex/CalloutClass.createContact';
import getcontextedUser from '@salesforce/apex/CalloutClass.getUser';
import deleteRecord from '@salesforce/apex/CalloutClass.deleteRecord';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'



export default class MelnDemo extends LightningElement {
    @track contacts = [];
    @track createCon = {};
    @track user = {};
    isLoading = false;
    async connectedCallback() {
        // let result = ;
        this.user = await getcontextedUser();
        this.contacts = JSON.parse(await getContact()).contacts;
        console.log('this.contacts ::' + JSON.stringify(this.contacts));
    }
    handleChange(event) {
        this.createCon[event.target.name] = event.target.value;
    }
    async handleSubmit(event) {
        event.preventDefault();
        const isInputsCorrect = [...this.template.querySelectorAll('lightning-input')]
            .reduce((validSoFar, inputField) => {
                inputField.reportValidity();
                return validSoFar && inputField.checkValidity();
            }, true);
        if (isInputsCorrect) {
            this.isLoading = true;
            this.createCon["creator"] = this.user.Name;
            this.createCon["createdbysfid"] = this.user.Id;
            let result;
            try {
                result = await createContact({ body: JSON.stringify(this.createCon) });
                this.contacts = JSON.parse(await getContact()).contacts;
                this.showToast('Success', 'success', 'Contact Created Successfully.');
                this.blankOutvalue();
                this.isLoading = false;
            }
            catch (e) {
                this.isLoading = false;
                alert(`error>` + JSON.stringify(e))
            }
        }
    }
    showToast(title, variant, message) {
        const event = new ShowToastEvent({
            title: title,
            variant: variant,
            message: message,
        });
        this.dispatchEvent(event);
    }
    blankOutvalue() {
        this.template.querySelectorAll('lightning-input').forEach(el => {
            el.value = '';
        })
    }
    deleteRecord = async (event) => {
        // alert(event.target.dataset.id);
        try {
            await deleteRecord({ recid: event.target.dataset.id });
            this.contacts = JSON.parse(await getContact()).contacts;
            this.showToast('Success', 'success', 'Contact deleted Successfully.');
        }
        catch (e) {
            this.showToast('Error', 'error', 'Issue with contact deletion::' + JSON.stringify(e));
        }
    }
}
