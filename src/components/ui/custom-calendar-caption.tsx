import {
	CaptionNavigation,
	CaptionProps,
	useDayPicker,
	useNavigation,
} from "react-day-picker";

export interface CaptionLabelProps {
	id?: string;
	displayMonth: Date;
	displayIndex?: number | undefined;
}

export function CustomCaptionLabel(props: CaptionLabelProps): JSX.Element {
	const {
		locale,
		classNames,
		styles,
		formatters: { formatCaption },
	} = useDayPicker();
	return (
		<div
			className={classNames.caption_label}
			style={styles.caption_label}
			aria-live="polite"
			role="presentation"
			id={props.id}
		>
			{formatCaption(props.displayMonth, { locale })}
		</div>
	);
}

export function CustomCalendarCaptionComponent(props: CaptionProps) {
	const { classNames, styles } = useDayPicker();
	const { goToMonth, nextMonth, previousMonth } = useNavigation();
	return (
		<div className={classNames.caption} style={styles.caption}>
			<CustomCaptionLabel
				id={props.id}
				displayMonth={props.displayMonth}
				displayIndex={props.displayIndex}
			/>
			<CaptionNavigation
				displayMonth={props.displayMonth}
				displayIndex={props.displayIndex}
				id={props.id}
			/>
		</div>
	);
}
