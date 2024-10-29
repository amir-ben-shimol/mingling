import React, { useEffect, useState } from 'react';
import { View, Dimensions } from 'react-native';
import PDFReader from 'react-native-pdf';
import Share from 'react-native-share';
import { UIText } from './UIText';
import { UIButton } from './UIButton';
import { UISpinner } from './UISpinner';

type Props = {
	readonly file: string;
};

const UIPdfViewer = (props: Props) => {
	const [pdfUri, setPdfUri] = useState<string | null>(props.file);
	const [loading, setLoading] = useState<boolean>(false);
	const windowWidth = Dimensions.get('window').width - 32; // 32 represent the px-2 comes from <BadeLayout> component

	useEffect(() => {
		setPdfUri(props.file);
	}, [props.file]);

	return (
		<View className="w-full items-center justify-center">
			{pdfUri ? (
				<View className="flex w-full items-center">
					{loading ? (
						<View className="flex items-center justify-center bg-zinc-100" style={{ width: windowWidth, height: 500 }}>
							<UISpinner size="large" />
						</View>
					) : (
						<View className="flex items-center justify-center bg-zinc-100 py-6">
							<PDFReader
								key={props.file}
								source={{ uri: pdfUri }}
								style={{ width: windowWidth, height: 350 }}
								onLoadComplete={() => setLoading(false)}
								onError={() => setLoading(false)}
							/>
						</View>
					)}
				</View>
			) : (
				<View className="mt-5 w-full items-center">
					<UIText>אירעה שגיאה בהצגת המסמך</UIText>
				</View>
			)}
		</View>
	);
};

const SharePdfButton = ({ pdfUri, title }: { pdfUri: string; title?: string }) => {
	const [loading, setLoading] = useState<boolean>(false);

	const sharePdf = async () => {
		if (pdfUri) {
			setLoading(false);

			try {
				await Share.open({ url: pdfUri, filename: title ?? 'prescription.pdf' });
			} catch (error) {
				console.error('Error sharing file:', error);
			} finally {
				setLoading(false);
			}
		}
	};

	return (
		<UIButton
			noStyles
			className="border-blueSecondery flex flex-row items-center justify-center rounded-[38px] border px-[10px] py-1"
			label="הורדה"
			isIconFirst
			icon="share"
			iconClassName="w-[23px] h-[23px] mr-1"
			iconSize="medium"
			varient="whiteLightBlueBorder"
			isLoading={loading}
			onClick={sharePdf}
		/>
	);
};

export { UIPdfViewer, SharePdfButton };
