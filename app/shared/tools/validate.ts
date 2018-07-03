import { Observable } from 'data/observable';

/*
    verifyInput(fieldId, pageModel, config, configName)
        * fielId: id of configObject, argsObject (ex: args.object.id)
        * pageModel: page model
        * config: Object Config (ex: signUpConfig)
        * configName: name of object config (ex 'signUpConfig'), configName used by notifyPropertyChange method
*/
export function verifyInput(fieldId: string, pageModel: any, config: any, configName: string) {
    var field: any;
    for (var i in config) {
        if (config[i].id == fieldId) {
            field = config[i];
            break;
        }
    }
    if (fieldId && field.errors) {
        for (var i in field.errors) {
            field.errors[i].error = false;
            field.error = false;
            field.messageError = ' ';
            switch (i) {
                case 'required':
                    field = checkRequired(field);
                    if (field.errors[i].error) {
                        // if error, Update view to show error
                        pageModel.notifyPropertyChange.call(pageModel, configName, config);
                        return false;
                    }
                    break;
                case 'length':
                    field = checkLength(field);
                    if (field.errors[i].error) {
                        // if error, Update view to show error
                        pageModel.notifyPropertyChange.call(pageModel, configName, config);
                        return false;
                    }
                    break;
                case 'format':
                    field = checkFormat(field);
                    if (field.errors[i].error) {
                        // if error, Update view to show error
                        pageModel.notifyPropertyChange.call(pageModel, configName, config);
                        return false;
                    }
                    break;
                case 'match':
                    var fieldIdMatch = field.matchField;
                    field = checkMatch(field, config[fieldIdMatch].value);
                    if (field.errors[i].error) {
                        // if error, Update view to show error
                        pageModel.notifyPropertyChange.call(pageModel, configName, config);
                        return false;
                    }
                    break;
                case 'invalid':
                    field = checkInvalid(field);
                    if (field.errors[i].error) {
                        // if error, Update view to show error
                        pageModel.notifyPropertyChange.call(pageModel, configName, config);
                        return false;
                    }
                    break;
                default:
                    break;
            }
        }
    }
    pageModel.notifyPropertyChange.call(pageModel, configName, config);
    return true;
}


function checkRequired(field) {
    if (field.value.trim) {
        field.value = field.value.trim()
    }
    if (!field.value) {
        field.errors['required'].error = true;
        field.error = true;
        field.messageError = field.errors['required'].message;
    }
    return field;
}
function checkLength(field) {
    if (field.value.trim()) {
        field.value = field.value.trim()
    }
    if (field.value.length > field.errors['length'].max || field.value.length < field.errors['length'].min) {
        field.errors['length'].error = true;
        field.error = true;
        field.messageError = field.errors['length'].message;
    }
    return field;
}

function checkFormat(field) {
    var regex;
    if (field.value.trim()) {
        field.value = field.value.trim()
    }
    switch (field.type) {
        case 'phone':
            regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
            break;
        case 'password':
            regex = /^[a-zA-Z0-9]{8,12}$/;
            break;
        case 'id':
            regex = /^[a-zA-Z0-9_]+$/;
            break;
        case 'name':
            regex = /^[a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêếìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹý ]+$/;
            break;
        case 'number':
            regex = /^[0-9]+$/;
            break;
        case 'email':
            regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            break;
        case 'code':
            regex = /^[a-zA-Z0-9]{6,6}$/;
        default:
            break;
    }
    field.errors['format'].error = false;
    if (!regex.test(field.value)) {
        field.errors['format'].error = true;
        field.error = true;
        field.messageError = field.errors['format'].message;
    }
    return field;
}

function checkMatch(field, valueMatch) {
    if (field.value.trim()) {
        field.value = field.value.trim();
    }
    if (valueMatch.trim()) {
        valueMatch = valueMatch.trim()
    }
    field.errors['match'].error = false;
    if (field.value !== valueMatch) {
        field.errors['match'].error = true;
        field.error = true;
        field.messageError = field.errors['match'].message;
    }
    return field;
}

function checkInvalid(field) {
    var regex = /^[a-zA-Z0-9]{1,20}$/;
    if (!regex.test(field.value)) {
        field.errors['invalid'].error = true;
        field.error = true;
        field.messageError = field.errors['invalid'].message;
    }
    return field;
}

