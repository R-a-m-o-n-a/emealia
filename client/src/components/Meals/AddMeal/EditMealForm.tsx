import {Switch, Textarea, TextInput} from "@mantine/core";
import {useForm} from '@mantine/form';

import "./EditMealForm.css";
import {t} from "../../../utils/translate.ts";

export function EditMealForm({}) {

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            title: '',
            category: '', // todo an Objektstruktur anpassen
            freeText: '',
            isPrivate: false,
            isToTry: false,
        },
        /*
                validate: {
                    email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
                },*/
    });

    return (
        <div className={"EditMealForm"}>
            <TextInput
                radius="sm"
                label={t("Title")}
                withAsterisk
                key={form.key('title')}
                {...form.getInputProps('title')}
            />
            <Select
                placeholder={t("Choose Category")}
                data={['React', 'Angular', 'Svelte', 'Vue']}
                key={form.key('category')}
                {...form.getInputProps('category')}
            />
            <Switch
                label={t("Make Private")}
                key={form.key('isPrivate')}
                {...form.getInputProps('isPrivate', {type: 'checkbox'})}
            />
            <Switch
                key={form.key('isToTry')}
                {...form.getInputProps('isToTry', {type: 'checkbox'})}
            />
            <Textarea
                placeholder={t("Here you can type anything your heart desires")}
                key={form.key('freeText')}
                {...form.getInputProps('freeText')}
            />
        </div>
    );
}
